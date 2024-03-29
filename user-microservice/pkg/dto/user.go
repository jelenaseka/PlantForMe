package dto

import (
	"user-microservise/pkg/data"

	"github.com/go-playground/validator"
)

type UserRequest struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=3"`
	Role     int    `json:"role" validate:"min=0,max=2"`
}

type UserResponse struct {
	ID       string    `json:"id" validate:"required,uuid"`
	Username string    `json:"username" validate:"required"`
	Role     data.Role `json:"role" validate:"min=0,max=2"`
}

func NewUserResponse(user data.User) *UserResponse {
	return &UserResponse{
		ID:       user.ID.String(),
		Username: user.Username,
		Role:     user.Role,
	}
}

func ConvertUserToUserResponse(user *data.User) *UserResponse {
	return &UserResponse{
		ID:       user.ID.String(),
		Username: user.Username,
		Role:     user.Role,
	}
}

func (u *UserRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(u)
}
