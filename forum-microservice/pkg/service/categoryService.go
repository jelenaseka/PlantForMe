package service

import (
	"errors"
	"fmt"
	"forum-microservice/pkg/data"
	"forum-microservice/pkg/dto"
	"forum-microservice/pkg/repository"
	"forum-microservice/pkg/utils/error_utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type categoryService struct {
	ICategoryRepository repository.CategoryRepositoryInterface
}

type CategoryServiceInterface interface {
	GetOneById(id uuid.UUID) (*dto.CategoryResponse, error_utils.MessageErr)
	GetAll() ([]dto.CategoryResponse, error_utils.MessageErr)
	Create(categoryRequest *dto.CategoryRequest) (*uuid.NullUUID, error_utils.MessageErr)
	Update(categoryRequest *dto.CategoryRequest, id uuid.UUID) error_utils.MessageErr
	Delete(id uuid.UUID) error_utils.MessageErr
	GetAllCountPosts() ([]dto.CategoryCountPostsResponse, error_utils.MessageErr)
}

func NewCategoryService(r repository.CategoryRepositoryInterface) CategoryServiceInterface {
	return &categoryService{r}
}

func (this *categoryService) GetAll() ([]dto.CategoryResponse, error_utils.MessageErr) {
	categories, err := this.ICategoryRepository.FindAll()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve categories: %s", err.Error()))
	}

	categoriesResponse := make([]dto.CategoryResponse, 0)
	for _, v := range categories {
		categoriesResponse = append(categoriesResponse, *dto.NewCategoryResponseFromCategory(v))
	}
	return categoriesResponse, nil
}

func (this *categoryService) GetOneById(id uuid.UUID) (*dto.CategoryResponse, error_utils.MessageErr) {
	category, err := this.ICategoryRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The category with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve category: %s", err.Error()))
		}

	}

	categoryResponse := dto.ConvertCategoryToCategoryResponse(category)

	return categoryResponse, nil
}

func (this *categoryService) Create(categoryRequest *dto.CategoryRequest) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()
	category := data.NewCategory(id, categoryRequest.Name)

	_, err := this.ICategoryRepository.FindByName(category.Name)
	if err == nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Category with the name %s already exists in the database.", category.Name))
	}

	err = this.ICategoryRepository.Create(category)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create category: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (this *categoryService) Update(categoryRequest *dto.CategoryRequest, id uuid.UUID) error_utils.MessageErr {
	category := data.NewCategory(id, categoryRequest.Name)

	_, err := this.ICategoryRepository.FindById(category.ID)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The category with the id %s is not found in the database.", id.String()))
	}

	foundCategory, err := this.ICategoryRepository.FindByName(category.Name)
	if err == nil && foundCategory.ID != category.ID {
		return error_utils.NewConflictError(fmt.Sprintf("Category with the name %s already exists in the database.", category.Name))
	}

	err = this.ICategoryRepository.Update(category)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update category: %s", err.Error()))
	}
	return nil
}

func (this *categoryService) Delete(id uuid.UUID) error_utils.MessageErr {
	_, err := this.ICategoryRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The category with the id %s is not found in the database.", id.String()))
	}

	this.ICategoryRepository.Delete(id)
	return nil
}

func (this *categoryService) GetAllCountPosts() ([]dto.CategoryCountPostsResponse, error_utils.MessageErr) {
	categories, err := this.ICategoryRepository.FindAllCountPosts()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve categories: %s", err.Error()))
	}

	categoriesResponse := make([]dto.CategoryCountPostsResponse, 0)
	for _, v := range categories {
		categoriesResponse = append(categoriesResponse, *dto.NewCategoryCountPostsResponse(v.ID.String(), v.Name, v.PostsCount))
	}
	return categoriesResponse, nil
}
