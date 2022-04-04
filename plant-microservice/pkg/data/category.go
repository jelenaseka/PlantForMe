package data

import (
	"encoding/json"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	ID   uuid.UUID `gorm:"type:varchar(36)" json:"id"`
	Name string    `gorm:"type:varchar(255);unique" json:"name" validate:"required"`
}

func NewCategory(id uuid.UUID, name string) *Category {
	return &Category{
		ID:   id,
		Name: name,
	}
}

func (c Category) String() string {
	out, err := json.Marshal(c)
	if err != nil {
		panic(err)
	}

	return string(out)
}
