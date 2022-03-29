package repository

import (
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"

	"github.com/google/uuid"
)

type PlantRepository struct {
}

func NewPlantRepository() *PlantRepository {
	return &PlantRepository{}
}

func (repo *PlantRepository) GetAll() ([]data.Plant, error) {
	db := config.GetDB()
	var plants []data.Plant
	result := db.Preload("BloomingMonths").Joins("Category").Find(&plants)

	if result.Error != nil {
		return nil, result.Error
	}

	return plants, nil
}

func (repo *PlantRepository) FindById(id uuid.UUID) (*data.Plant, error) {
	db := config.GetDB()
	var plant data.Plant
	result := db.First(&plant, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &plant, nil
}

func (repo *PlantRepository) FindByName(name string) (*data.Plant, error) {
	db := config.GetDB()
	var plant data.Plant
	result := db.First(&plant, "name = ?", name)

	if result.Error != nil {
		return nil, result.Error
	}

	return &plant, nil
}

func (repo *PlantRepository) Create(plant *data.Plant) error {
	db := config.GetDB()
	result := db.Create(&plant)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *PlantRepository) Update(plant *data.Plant) error {
	db := config.GetDB()
	result := db.Save(&plant)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *PlantRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Delete(&data.Plant{}, id.String())
}
