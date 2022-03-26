package service

import (
	"plant-microservice/pkg/repository"
)

type PlantService struct {
	PlantRepository *repository.PlantRepository
}

func NewPlantService(r *repository.PlantRepository) *PlantService {
	return &PlantService{r}
}

func (service *PlantService) GetAll() {

}
