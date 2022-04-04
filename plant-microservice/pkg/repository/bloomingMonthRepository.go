package repository

import (
	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
)

type bloomingMonthRepository struct {
}

type BloomingMonthRepositoryInterface interface {
	FindByMonth(month data.Month) (*data.BloomingMonth, error)
}

func NewBloomingMonthRepository() BloomingMonthRepositoryInterface {
	return &bloomingMonthRepository{}
}

func (repo *bloomingMonthRepository) FindByMonth(month data.Month) (*data.BloomingMonth, error) {
	db := config.GetDB()
	var bloomingMonth data.BloomingMonth
	result := db.First(&bloomingMonth, "month = ?", month)

	if result.Error != nil {
		return nil, result.Error
	}

	return &bloomingMonth, nil
}
