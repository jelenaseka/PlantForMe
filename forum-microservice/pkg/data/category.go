package data

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	ID    uuid.UUID `gorm:"type:varchar(36)" json:"id"`
	Name  string    `gorm:"type:varchar(255);unique" json:"name" validate:"required"`
	Posts []Post
}

type CategoryCountPosts struct {
	ID         uuid.UUID
	Name       string
	PostsCount int
}

func NewCategory(id uuid.UUID, name string) *Category {
	return &Category{
		ID:   id,
		Name: name,
	}
}
