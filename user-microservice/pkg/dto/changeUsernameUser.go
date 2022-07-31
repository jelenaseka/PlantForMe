package dto

import "github.com/go-playground/validator"

type ChangeUsernameRequest struct {
	NewUsername string `json:"newUsername" validate:"required,min=3"`
}

func (u *ChangeUsernameRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(u)
}
