package data

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Collection struct {
	gorm.Model
	ID               uuid.UUID
	Name             string
	Description      string
	CollectionPlants []CollectionPlant
	Username         string
}

func NewCollection(id uuid.UUID, name string, description string, username string) *Collection {
	return &Collection{
		ID:          id,
		Name:        name,
		Description: description,
		Username:    username,
	}
}
