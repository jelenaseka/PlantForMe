package data

import (
	"github.com/google/uuid"
)

type Category struct {
	ID   uuid.UUID `gorm:"type:varchar(36)" json:"id"`
	Name string    `gorm:"type:varchar(255);unique" json:"name" validate:"required"`
}
