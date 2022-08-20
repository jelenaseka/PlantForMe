package repository

import (
	"plantcare-microservice/pkg/config"
	"plantcare-microservice/pkg/data"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type collectionPlantRepository struct {
}

type CollectionPlantRepositoryInterface interface {
	FindAllByCollectionId(id uuid.UUID) ([]data.CollectionPlant, error)
	FindById(id uuid.UUID) (*data.CollectionPlant, error)
	Create(*data.CollectionPlant) error
	Update(*data.CollectionPlant) error
	Delete(id uuid.UUID)
}

func NewCollectionPlantRepository() CollectionPlantRepositoryInterface {
	return &collectionPlantRepository{}
}

func (this *collectionPlantRepository) FindAllByCollectionId(id uuid.UUID) ([]data.CollectionPlant, error) {
	db := config.GetDB()
	var collectionPlants []data.CollectionPlant
	//todo order tasks by date desc
	result := db.Debug().Preload("Tasks", "status = ?", "WAITING", func(db *gorm.DB) *gorm.DB {
		return db.Order("tasks.date DESC")
	}).Where("collection_id = ?", id.String()).Find(&collectionPlants)

	if result.Error != nil {
		return nil, result.Error
	}

	return collectionPlants, nil
}

func (this *collectionPlantRepository) FindById(id uuid.UUID) (*data.CollectionPlant, error) {
	db := config.GetDB()
	var collectionPlant data.CollectionPlant
	result := db.Preload("Collection").Preload("Tasks", func(db *gorm.DB) *gorm.DB {
		return db.Order("tasks.date DESC")
	}).First(&collectionPlant, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &collectionPlant, nil
}

func (this *collectionPlantRepository) Create(collectionPlant *data.CollectionPlant) error {
	db := config.GetDB()
	result := db.Create(&collectionPlant)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *collectionPlantRepository) Update(collectionPlant *data.CollectionPlant) error {
	db := config.GetDB()
	result := db.Save(&collectionPlant)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *collectionPlantRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.CollectionPlant{}, "id = ?", id.String())
}
