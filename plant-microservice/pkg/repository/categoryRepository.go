package repository

import (
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"

	"github.com/google/uuid"
)

type categoryRepository struct {
}

type CategoryRepositoryInterface interface {
	FindById(id uuid.UUID) (*data.Category, error)
	FindAll() ([]data.Category, error)
	FindByName(name string) (*data.Category, error)
	Create(category *data.Category) error
	Update(category *data.Category) error
	Delete(id uuid.UUID)
}

func NewCategoryRepository() CategoryRepositoryInterface {
	return &categoryRepository{}
}

func (this *categoryRepository) FindAll() ([]data.Category, error) {
	db := config.GetDB()
	var categories []data.Category
	result := db.Debug().Find(&categories)

	if result.Error != nil {
		return nil, result.Error
	}

	return categories, nil
}

func (this *categoryRepository) FindById(id uuid.UUID) (*data.Category, error) {
	db := config.GetDB()
	var cat data.Category
	result := db.First(&cat, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &cat, nil
}

func (this *categoryRepository) FindByName(name string) (*data.Category, error) {
	db := config.GetDB()
	var cat data.Category
	result := db.First(&cat, "name = ?", name)

	if result.Error != nil {
		return nil, result.Error
	}

	return &cat, nil
}

func (this *categoryRepository) Create(category *data.Category) error {
	db := config.GetDB()
	result := db.Create(&category)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *categoryRepository) Update(category *data.Category) error {
	db := config.GetDB()
	result := db.Save(&category)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *categoryRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Category{}, "id = ?", id.String())
}
