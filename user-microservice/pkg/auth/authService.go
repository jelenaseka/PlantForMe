package auth

import (
	"encoding/hex"
	"errors"
	"fmt"
	"time"
	"user-microservise/pkg/crypto"
	"user-microservise/pkg/data"
	"user-microservise/pkg/repository"
	"user-microservise/pkg/utils/error_utils"

	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

var jwtKey = []byte("my_secret_key")

type authService struct {
	IUserRepository repository.UserRepositoryInterface
}

type AuthServiceInterface interface {
	ValidateCredentials(credentials Credentials) (*data.User, error_utils.MessageErr)
	IssueToken(user *data.User) (string, error_utils.MessageErr)
	Me(username string) (*data.User, error_utils.MessageErr)
}

func NewAuthService(r repository.UserRepositoryInterface) AuthServiceInterface {
	return &authService{r}
}

func (this *authService) ValidateCredentials(credentials Credentials) (*data.User, error_utils.MessageErr) {
	user, err := this.IUserRepository.FindByUsername(credentials.Username)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			fmt.Print("ne postoji username")
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("User with username don't exist."))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve user: %s", err.Error()))
		}
	}

	hashedPassword := crypto.NewSHA256([]byte(credentials.Password))
	if hex.EncodeToString(hashedPassword) != user.Password {
		return nil, error_utils.NewNotFoundError(fmt.Sprintf("Hashed password is invalid."))
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

	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		// If there is an error in creating the JWT return an internal server error
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
