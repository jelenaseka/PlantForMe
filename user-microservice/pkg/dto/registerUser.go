package dto

import "github.com/go-playground/validator"

type RegisterUserRequest struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=3"`
}

func (u *RegisterUserRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(u)
}
