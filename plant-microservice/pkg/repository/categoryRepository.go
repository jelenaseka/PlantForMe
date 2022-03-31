package repository

import (
	"fmt"
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"

	"github.com/google/uuid"
)

type categoryRepository struct {
}

type CategoryRepositoryInterface interface {
	FindById(id uuid.UUID) (*data.Category, error)
}

func NewCategoryRepository() CategoryRepositoryInterface {
	return &categoryRepository{}
}

func (repo *categoryRepository) FindById(id uuid.UUID) (*data.Category, error) {
	db := config.GetDB()
	var cat data.Category
	result := db.First(&cat, "id = ?", id.String())
	fmt.Printf("Category: %v", cat)

	if result.Error != nil {
		return nil, result.Error
	}

	return &cat, nil
}
