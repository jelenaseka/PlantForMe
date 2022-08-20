package data

import (
	"gorm.io/gorm"
)

type PlantReference struct {
	gorm.Model
	ID          string `json:"id"`
	Name        string `json:"name"`
	Base64Image string `json:"image"`
}
