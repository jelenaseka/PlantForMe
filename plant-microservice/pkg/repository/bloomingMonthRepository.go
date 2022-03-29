package repository

import (
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
)

type BloomingMonthRepository struct {
}

func NewBloomingMonthRepository() *BloomingMonthRepository {
	return &BloomingMonthRepository{}
}

func (repo *BloomingMonthRepository) FindByMonth(month data.Month) (*data.BloomingMonth, error) {
	db := config.GetDB()
	var bloomingMonth data.BloomingMonth
	result := db.First(&bloomingMonth, "month = ?", month)

	if result.Error != nil {
		return nil, result.Error
	}

	return &bloomingMonth, nil
}
