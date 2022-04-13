package auth

import (
	"encoding/hex"
	"errors"
	"fmt"
	"time"
	"user-microservise/pkg/crypto"
	"user-microservise/pkg/data"
	"user-microservise/pkg/dto"
	"user-microservise/pkg/repository"
	"user-microservise/pkg/utils/error_utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var JwtKey []byte

type authService struct {
	IUserRepository repository.UserRepositoryInterface
}

type AuthServiceInterface interface {
	ValidateCredentials(credentials Credentials) (*data.User, error_utils.MessageErr)
	IssueToken(user *data.User) (string, error_utils.MessageErr)
	Me(username string) (*data.User, error_utils.MessageErr)
	Registration(registerUserRequest *dto.RegisterUserRequest) (*uuid.NullUUID, error_utils.MessageErr)
}

func NewAuthService(r repository.UserRepositoryInterface) AuthServiceInterface {
	return &authService{r}
}

func (this *authService) ValidateCredentials(credentials Credentials) (*data.User, error_utils.MessageErr) {
	user, err := this.IUserRepository.FindByUsername(credentials.Username)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("User with username %s don't exist.", credentials.Username))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve user: %s", err.Error()))
		}
	}

	hashedPassword := crypto.NewSHA256([]byte(credentials.Password))
	if hex.EncodeToString(hashedPassword) != user.Password {
		return nil, error_utils.NewNotFoundError(fmt.Sprintf("Wrong password."))
	}

	return user, nil
}

func (this *authService) IssueToken(user *data.User) (string, error_utils.MessageErr) {
	expirationTime := time.Now().Add(60 * time.Minute)

	claims := &Claims{
		Username: user.Username,
		Role:     user.Role,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(JwtKey)

	if err != nil {
		return "", error_utils.NewInternalServerError(fmt.Sprintf("Something went wrong when creating token."))
	}
	return tokenString, nil
}

func (this *authService) Me(username string) (*data.User, error_utils.MessageErr) {
	user, err := this.IUserRepository.FindByUsername(username)
	if err != nil {
		return nil, error_utils.NewNotFoundError(fmt.Sprintf("User with the username %s does not exist in the database.", username))
	}
	return user, nil
}

func (this *authService) Registration(registerUserRequest *dto.RegisterUserRequest) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()

	hashedPassword := crypto.NewSHA256([]byte(registerUserRequest.Password))
	user := data.NewUser(id, registerUserRequest.Username, hex.EncodeToString(hashedPassword), data.Role(1))

	_, err := this.IUserRepository.FindByUsername(user.Username)
	if err == nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("User with the username %s already exists in the database.", user.Username))
	}

	err = this.IUserRepository.Create(user)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create user: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}
