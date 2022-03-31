package service

import (
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"

	"github.com/google/uuid"
)

type categoryService struct {
	ICategoryRepository repository.CategoryRepositoryInterface
}

type CategoryServiceInterface interface {
	GetOneById(id uuid.UUID) (*data.Category, error)
}

func NewCategoryService(r repository.CategoryRepositoryInterface) CategoryServiceInterface {
	return &categoryService{r}
}

func (service *categoryService) GetOneById(id uuid.UUID) (*data.Category, error) {
	plant, err := service.ICategoryRepository.FindById(id)
	if err != nil {
		return nil, err
	}

	return plant, nil
}
