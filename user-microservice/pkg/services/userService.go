package services

import (
	"encoding/hex"
	"errors"
	"fmt"
	"user-microservise/pkg/crypto"
	"user-microservise/pkg/data"
	"user-microservise/pkg/dto"
	"user-microservise/pkg/repository"
	"user-microservise/pkg/utils/error_utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type userService struct {
	IUserRepository repository.UserRepositoryInterface
}

type UserServiceInterface interface {
	GetAll() ([]dto.UserResponse, error_utils.MessageErr)
	GetOneById(id uuid.UUID) (*dto.UserResponse, error_utils.MessageErr)
	Create(userRequest *dto.UserRequest) (*uuid.NullUUID, error_utils.MessageErr)
	Update(userRequest *dto.UserRequest, id uuid.UUID) error_utils.MessageErr
	Delete(id uuid.UUID) error_utils.MessageErr
}

func NewUserService(r repository.UserRepositoryInterface) UserServiceInterface {
	return &userService{r}
}

func (this *userService) GetAll() ([]dto.UserResponse, error_utils.MessageErr) {
	users, err := this.IUserRepository.FindAll()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve users: %s", err.Error()))
	}

	usersResponse := make([]dto.UserResponse, 0)
	for _, v := range users {
		usersResponse = append(usersResponse, *dto.NewUserResponse(v))
	}
	return usersResponse, nil
}

func (this *userService) GetOneById(id uuid.UUID) (*dto.UserResponse, error_utils.MessageErr) {
	user, err := this.IUserRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The user with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve user: %s", err.Error()))
		}
	}

	userResponse := dto.ConvertUserToUserResponse(user)
	return userResponse, nil
}

func (this *userService) Create(userRequest *dto.UserRequest) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()

	hashedPassword := crypto.NewSHA256([]byte(userRequest.Password))
	user := data.NewUser(id, userRequest.Username, hex.EncodeToString(hashedPassword), data.Role(userRequest.Role))

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

func (this *userService) Update(userRequest *dto.UserRequest, id uuid.UUID) error_utils.MessageErr {
	hashedPassword := crypto.NewSHA256([]byte(userRequest.Password))
	user := data.NewUser(id, userRequest.Username, hex.EncodeToString(hashedPassword), data.Role(userRequest.Role))

	_, err := this.IUserRepository.FindById(user.ID)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The user with the id %s is not found in the database.", id.String()))
	}

	foundUser, err := this.IUserRepository.FindByUsername(user.Username)
	if err == nil && foundUser.ID != user.ID {
		return error_utils.NewConflictError(fmt.Sprintf("User with the username %s already exists in the database.", user.Username))
	}

	err = this.IUserRepository.Update(user)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update user: %s", err.Error()))
	}
	return nil
}

func (this *userService) Delete(id uuid.UUID) error_utils.MessageErr {
	_, err := this.IUserRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The user with the id %s is not found in the database.", id.String()))
	}

	this.IUserRepository.Delete(id)
	return nil
}
