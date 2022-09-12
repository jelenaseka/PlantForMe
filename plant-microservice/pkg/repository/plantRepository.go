package repository

import (
	"fmt"
	"net/url"
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/utils"

	"github.com/google/uuid"
)

type plantRepository struct {
}

type PlantRepositoryInterface interface {
	FindAllReferentPlants() ([]data.ReferentPlant, error)
	FindAllByUrl(url.Values) ([]data.Plant, error)
	FindAllForCollectionPlantReference() ([]data.PlantReference, error)
	FindById(id uuid.UUID) (*data.Plant, error)
	FindByName(name string) (*data.Plant, error)
	FindReferentPlantsByReferentsIds(references []string) []data.ReferentPlant
	FindPlantsByIds(ids []string) []dto.PlantItem
	Create(plant *data.Plant) error
	Update(plant *data.Plant) error
	Delete(id uuid.UUID)
}

func NewPlantRepository() PlantRepositoryInterface {
	return &plantRepository{}
}

func (this *plantRepository) FindPlantsByIds(ids []string) []dto.PlantItem {
	db := config.GetDB()
	var plants []dto.PlantItem

	query := "select id, name, description, base64_image as image from plantdb.plants where ("
	for k, v := range ids {
		if k == len(ids)-1 {
			query += " id = '" + v + "')"
		} else {
			query += " id = '" + v + "'" + " OR "
		}
	}
	db.Debug().Raw(query).Find(&plants)

	return plants
}

func (this *plantRepository) FindReferentPlantsByReferentsIds(references []string) []data.ReferentPlant {
	db := config.GetDB()
	var plants []data.ReferentPlant

	if len(references) == 0 {
		return []data.ReferentPlant{}
	}

	query := "select id, name, light, watering, is_blooming, growth_rate, hardiness, height, life_time from plantdb.plants where ("

	for k, v := range references {
		if k == len(references)-1 {
			query += " id = '" + v + "')"
		} else {
			query += " id = '" + v + "'" + " OR "
		}
	}
	db.Debug().Raw(query).Find(&plants)

	return plants
}

func (repo *plantRepository) FindAllReferentPlants() ([]data.ReferentPlant, error) {
	db := config.GetDB()
	var plants []data.ReferentPlant

	query := "select id, name, light, watering, is_blooming, growth_rate, hardiness, height, life_time from plantdb.plants where deleted_at is NULL;"

	db.Debug().Raw(query).Find(&plants)

	return plants, nil
}

func (repo *plantRepository) FindAllByUrl(urlValues url.Values) ([]data.Plant, error) {
	db := config.GetDB()
	var plants []data.Plant

	query := "SELECT distinct pl.* from plantdb.plants pl left join plantdb.plant_blooming_months pbm on pbm.plant_id = pl.id left join plantdb.blooming_months bm on bm.id = pbm.blooming_month_id left join plantdb.categories c on pl.category_id = c.id where pl.deleted_at IS NULL "
	query += utils.BuildQuery(urlValues)
	fmt.Print(query)

	db.Debug().Raw(query).Scan(&plants)

	return plants, nil
}

func (repo *plantRepository) FindAllForCollectionPlantReference() ([]data.PlantReference, error) {
	db := config.GetDB()
	var plants []data.PlantReference

	query := "select p.id, p.name, p.base64_image from plantdb.plants p where p.deleted_at IS NULL"
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
