package service

import (
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"
)

type BloomingMonthService struct {
	BloomingMonthRepository *repository.BloomingMonthRepository
}

func NewBloomingMonthService(r *repository.BloomingMonthRepository) *BloomingMonthService {
	return &BloomingMonthService{r}
}

func (service *BloomingMonthService) GetOneByMonth(month data.Month) (*data.BloomingMonth, error) {
	bloomingMonth, err := service.BloomingMonthRepository.FindByMonth(month)
	if err != nil {
		return nil, err
	}

	return bloomingMonth, nil
}

func (service *BloomingMonthService) FindByMonths(months []int) []data.BloomingMonth {
	var bloomMonths []data.BloomingMonth
	for _, v := range months {
		bloomMonth, err := service.BloomingMonthRepository.FindByMonth(data.Month(v))
		if err != nil {
			return []data.BloomingMonth{}
		}
		bloomMonths = append(bloomMonths, data.BloomingMonth{ID: bloomMonth.ID, Month: bloomMonth.Month})
	}
	return bloomMonths
}
