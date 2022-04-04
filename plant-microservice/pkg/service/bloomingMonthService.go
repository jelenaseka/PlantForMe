package service

import (
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"
)

type bloomingMonthService struct {
	IBloomingMonthRepository repository.BloomingMonthRepositoryInterface
}

type BloomingMonthServiceInterface interface {
	GetOneByMonth(month data.Month) (*data.BloomingMonth, error)
	FindByMonths(months []int) []data.BloomingMonth
}

func NewBloomingMonthService(r repository.BloomingMonthRepositoryInterface) BloomingMonthServiceInterface {
	return &bloomingMonthService{r}
}

func (service *bloomingMonthService) GetOneByMonth(month data.Month) (*data.BloomingMonth, error) {
	bloomingMonth, err := service.IBloomingMonthRepository.FindByMonth(month)
	if err != nil {
		return nil, err
	}

	return bloomingMonth, nil
}

func (service *bloomingMonthService) FindByMonths(months []int) []data.BloomingMonth {
	var bloomMonths []data.BloomingMonth
	for _, v := range months {
		bloomMonth, err := service.IBloomingMonthRepository.FindByMonth(data.Month(v))
		if err != nil {
			return []data.BloomingMonth{}
		}
		bloomMonths = append(bloomMonths, data.BloomingMonth{ID: bloomMonth.ID, Month: bloomMonth.Month})
	}
	return bloomMonths
}
