package repository

import (
	"plantcare-microservice/pkg/config"
	"plantcare-microservice/pkg/data"

	"github.com/google/uuid"
)

type collectionRepository struct {
}

type CollectionRepositoryInterface interface {
	FindAll() ([]data.Collection, error)
	FindAllByUsername(username string) ([]data.Collection, error)
	FindById(id uuid.UUID) (*data.Collection, error)
	FindByName(name string) (*data.Collection, error)
	Create(collection *data.Collection) error
	Update(collection *data.Collection) error
	Delete(id uuid.UUID)
}

func NewCollectionRepository() CollectionRepositoryInterface {
	return &collectionRepository{}
}

func (this *collectionRepository) FindAll() ([]data.Collection, error) {
	db := config.GetDB()
	var collections []data.Collection
	result := db.Debug().Find(&collections)

	if result.Error != nil {
		return nil, result.Error
	}

	return collections, nil
}

func (this *collectionRepository) FindAllByUsername(username string) ([]data.Collection, error) {
	db := config.GetDB()
	var collections []data.Collection
	result := db.Where("username = ?", username).Find(&collections)

	if result.Error != nil {
		return nil, result.Error
	}

	return collections, nil
}

func (this *collectionRepository) FindById(id uuid.UUID) (*data.Collection, error) {
	db := config.GetDB()
	var collection data.Collection
	result := db.First(&collection, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &collection, nil
}

func (this *collectionRepository) FindByName(name string) (*data.Collection, error) {
	db := config.GetDB()
	var collection data.Collection
	result := db.First(&collection, "name = ?", name)

	if result.Error != nil {
		return nil, result.Error
	}

	return &collection, nil
}

func (this *collectionRepository) Create(collection *data.Collection) error {
	db := config.GetDB()
	result := db.Create(&collection)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *collectionRepository) Update(collection *data.Collection) error {
	db := config.GetDB()
	result := db.Save(&collection)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *collectionRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Collection{}, "id = ?", id.String())
}
