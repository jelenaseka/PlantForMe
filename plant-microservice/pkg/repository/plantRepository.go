package repository

import (
	"fmt"
	"net/url"
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/utils"

	"github.com/google/uuid"
)

type plantRepository struct {
}

type PlantRepositoryInterface interface {
	FindAll(url.Values) ([]data.Plant, error)
	FindById(id uuid.UUID) (*data.Plant, error)
	FindByName(name string) (*data.Plant, error)
	Create(plant *data.Plant) error
	Update(plant *data.Plant) error
	Delete(id uuid.UUID)
}

func NewPlantRepository() PlantRepositoryInterface {
	return &plantRepository{}
}

func (repo *plantRepository) FindAll(urlValues url.Values) ([]data.Plant, error) {
	db := config.GetDB()
	var plants []data.Plant

	query := "SELECT pl.* from plantdb.plants pl left join plantdb.plant_blooming_months pbm on pbm.plant_id = pl.id left join plantdb.blooming_months bm on bm.id = pbm.blooming_month_id left join plantdb.categories c on pl.category_id = c.id "
	query += utils.BuildQuery(urlValues)
	fmt.Print(query)

	db.Debug().Raw(query).Scan(&plants)

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
