package service

import (
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"

	"github.com/google/uuid"
)

type CategoryService struct {
	CategoryRepository *repository.CategoryRepository
}

func NewCategoryService(r *repository.CategoryRepository) *CategoryService {
	return &CategoryService{r}
}

func (service *CategoryService) GetOneById(id uuid.UUID) (*data.Category, error) {
	plant, err := service.CategoryRepository.FindById(id)
	if err != nil {
		return nil, err
	}

	return plant, nil
}
