package data

import (
	"github.com/google/uuid"
)

type Category struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name" validate:"required"`
	Code string    `json:"code" validate:"required"`
}
