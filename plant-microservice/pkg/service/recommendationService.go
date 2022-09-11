package service

import (
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"
)

type recommendationService struct {
	IPlantRepository repository.PlantRepositoryInterface
}

type RecommendationServiceInterface interface {
	GetSimilarPlants(references []string) []int
}

func NewRecommendationService(pr repository.PlantRepositoryInterface) RecommendationServiceInterface {
	return &recommendationService{pr}
}

func (this *recommendationService) getPlantsByReferentsIds(references []string) []data.ReferentPlant {
	return this.IPlantRepository.FindPlantsByReferentsIds(references)
}

func (this *recommendationService) calculateVectorOfUsersPlants(plant []data.ReferentPlant) []int {

	return []int{}
}

func (this *recommendationService) GetSimilarPlants(references []string) []int {
	plants := this.getPlantsByReferentsIds(references)
	return this.calculateVectorOfUsersPlants(plants)
}
