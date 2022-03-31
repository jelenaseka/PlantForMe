package repository

import (
	"fmt"
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"

	"github.com/google/uuid"
)

type plantRepository struct {
}

type PlantRepositoryInterface interface {
	GetAll() ([]data.Plant, error)
	FindById(id uuid.UUID) (*data.Plant, error)
	FindByName(name string) (*data.Plant, error)
	Create(plant *data.Plant) error
	Update(plant *data.Plant) error
	Delete(id uuid.UUID)
}

func NewPlantRepository() PlantRepositoryInterface {
	return &plantRepository{}
}

func (repo *plantRepository) GetAll() ([]data.Plant, error) {
	db := config.GetDB()
	var plants []data.Plant
	result := db.Debug().Preload("BloomingMonths").Joins("Category").Find(&plants)
	fmt.Print(plants[0].Category.Name)

	if result.Error != nil {
		return nil, result.Error
	}

	return plants, nil
}

func (repo *plantRepository) FindById(id uuid.UUID) (*data.Plant, error) {
	db := config.GetDB()
	var plant data.Plant
	result := db.Preload("BloomingMonths").Preload("Category").First(&plant, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &plant, nil
}

func (repo *plantRepository) FindByName(name string) (*data.Plant, error) {
	db := config.GetDB()
	var plant data.Plant
	result := db.First(&plant, "name = ?", name)

	if result.Error != nil {
		return nil, result.Error
	}

	return &plant, nil
}

func (repo *plantRepository) Create(plant *data.Plant) error {
	db := config.GetDB()
	result := db.Create(&plant)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *plantRepository) Update(plant *data.Plant) error {
	db := config.GetDB()
	result := db.Save(&plant)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *plantRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Plant{}, "id = ?", id.String())
}
