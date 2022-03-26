package repository

import (
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
)

type PlantRepository struct {
}

func NewPlantRepository() *PlantRepository {
	return &PlantRepository{}
}

func (repo *PlantRepository) GetAll() ([]data.Plant, error) {
	db := config.GetDB()
	var plants []data.Plant
	result := db.Find(&plants)

	if result.Error != nil {
		return nil, result.Error
	}

	return plants, nil
}
