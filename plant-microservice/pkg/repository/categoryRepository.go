package repository

import (
	"fmt"
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"

	"github.com/google/uuid"
)

type CategoryRepository struct {
}

func NewCategoryRepository() *CategoryRepository {
	return &CategoryRepository{}
}

func (repo *CategoryRepository) FindById(id uuid.UUID) (*data.Category, error) {
	db := config.GetDB()
	var cat data.Category
	result := db.First(&cat, "id = ?", id.String())
	fmt.Printf("Category: %v", cat)

	if result.Error != nil {
		return nil, result.Error
	}

	return &cat, nil
}
