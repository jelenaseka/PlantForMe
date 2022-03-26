package data

import (
	"encoding/json"

	"github.com/google/uuid"
)

type Category struct {
	ID   uuid.UUID `gorm:"type:varchar(36)" json:"id"`
	Name string    `gorm:"type:varchar(255);unique" json:"name" validate:"required"`
}

func (c Category) String() string {
	out, err := json.Marshal(c)
	if err != nil {
		panic(err)
	}

	return string(out)
}
