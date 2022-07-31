package dto

import "github.com/go-playground/validator"

type ChangePasswordRequest struct {
	NewPassword string `json:"newPassword" validate:"required,min=3"`
}

func (u *ChangePasswordRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(u)
}
