package repository

import (
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"

	"github.com/google/uuid"
)

type plantReviewRepository struct {
}

type PlantReviewRepositoryInterface interface {
	FindAllByPlant(uuid.UUID) ([]data.PlantReview, error)
	FindAverageRatingByPlant(uuid.UUID) (float64, error)
	FindOneByPlantAndUsername(uuid.UUID, string) (*data.PlantReview, error)
	Create(plantReview *data.PlantReview) error
	FindById(id uuid.UUID) (*data.PlantReview, error)
	Update(plantReview *data.PlantReview) error
	Delete(id uuid.UUID)
}

func NewPlantReviewRepository() PlantReviewRepositoryInterface {
	return &plantReviewRepository{}
}

func (repo *plantReviewRepository) FindById(id uuid.UUID) (*data.PlantReview, error) {
	db := config.GetDB()
	var plantReview data.PlantReview
	result := db.First(&plantReview, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &plantReview, nil
}

func (repo *plantReviewRepository) FindAllByPlant(id uuid.UUID) ([]data.PlantReview, error) {
	db := config.GetDB()
	var plantReviews []data.PlantReview
	result := db.Where("plant_id = ?", id).Find(&plantReviews)

	if result.Error != nil {
		return nil, result.Error
	}

	return plantReviews, nil
}

func (repo *plantReviewRepository) FindAverageRatingByPlant(id uuid.UUID) (float64, error) {
	db := config.GetDB()
	var averageRating float64
	result := db.Debug().Where("plant_id = ?", id).Table("plant_reviews").Select("ifnull(AVG(rating), 0)").Find(&averageRating)
	if result.Error != nil {
		return -1, result.Error
	}

	return averageRating, nil
}

func (repo *plantReviewRepository) FindOneByPlantAndUsername(id uuid.UUID, username string) (*data.PlantReview, error) {
	db := config.GetDB()
	var plantReview data.PlantReview
	result := db.Where("plant_id = ? AND username = ?", id, username).First(&plantReview)

	if result.Error != nil {
		return nil, result.Error
	}

	return &plantReview, nil
}

func (repo *plantReviewRepository) Create(plantReview *data.PlantReview) error {
	db := config.GetDB()
	result := db.Create(&plantReview)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *plantReviewRepository) Update(plantReview *data.PlantReview) error {
	db := config.GetDB()
	result := db.Save(&plantReview)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *plantReviewRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.PlantReview{}, "id = ?", id.String())
}
