package service

import (
	"errors"
	"fmt"
	"net/url"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/repository"
	"plant-microservice/pkg/utils/error_utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type plantService struct {
	IPlantRepository      repository.PlantRepositoryInterface
	ICategoryService      CategoryServiceInterface
	IBloomingMonthService BloomingMonthServiceInterface
}

type PlantServiceInterface interface {
	GetAll(url.Values) ([]dto.PlantResponse, error_utils.MessageErr)
	GetOneById(uuid.UUID) (*dto.PlantResponse, error_utils.MessageErr)
	Create(*dto.PlantRequest) (*uuid.NullUUID, error_utils.MessageErr)
	Update(*dto.PlantRequest, uuid.UUID) error_utils.MessageErr
	Delete(uuid.UUID) error_utils.MessageErr
}

func NewPlantService(r repository.PlantRepositoryInterface, c CategoryServiceInterface, bm BloomingMonthServiceInterface) PlantServiceInterface {
	return &plantService{r, c, bm}
}

func (service *plantService) GetAll(urlValues url.Values) ([]dto.PlantResponse, error_utils.MessageErr) {
	plants, err := service.IPlantRepository.FindAll(urlValues)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve plants: %s", err.Error()))
	}

	plantsResponse := make([]dto.PlantResponse, 0)
	for _, v := range plants {
		plantsResponse = append(plantsResponse, *dto.NewPlantResponseFromPlant(v))
	}
	return plantsResponse, nil
}

func (service *plantService) GetOneById(id uuid.UUID) (*dto.PlantResponse, error_utils.MessageErr) {
	plant, err := service.IPlantRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The plant with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve plant: %s", err.Error()))
		}

	}

	plantResponse := dto.ConvertPlantToPlantResponse(plant)

	return plantResponse, nil
}

func (service *plantService) Create(plantRequest *dto.PlantRequest) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()
	bloomMonths := service.IBloomingMonthService.FindByMonths(plantRequest.BloomingMonths)
	plant := dto.ConvertPlantRequestToPlant(plantRequest, bloomMonths, id)

	_, err := service.IPlantRepository.FindByName(plant.Name)
	if err == nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Plant with the name %s already exists in the database.", plant.Name))
	}

	_, err = service.ICategoryService.GetOneById(plant.CategoryID)
	if err != nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Category with the id %s does not exists in the database.", plant.CategoryID.String()))
	}

	err = service.IPlantRepository.Create(plant)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create plant: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (service *plantService) Update(plantRequest *dto.PlantRequest, id uuid.UUID) error_utils.MessageErr {
	bloomMonths := service.IBloomingMonthService.FindByMonths(plantRequest.BloomingMonths)
	plant := dto.ConvertPlantRequestToPlant(plantRequest, bloomMonths, id)

	_, err := service.IPlantRepository.FindById(plant.ID)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The plant with the id %s is not found in the database.", id.String()))
	}

	foundPlant, err := service.IPlantRepository.FindByName(plant.Name)
	if err == nil && foundPlant.ID != plant.ID {
		return error_utils.NewConflictError(fmt.Sprintf("Plant with the name %s already exists in the database.", plant.Name))
	}

	_, err = service.ICategoryService.GetOneById(plant.CategoryID)
	if err != nil {
		return error_utils.NewConflictError(fmt.Sprintf("Category with the id %s does not exists in the database.", plant.CategoryID.String()))
	}

	err = service.IPlantRepository.Update(plant)
	if err != nil {
		// return nil, error_formats.ParseError(getError)
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update plant: %s", err.Error()))
	}
	return nil
}

func (service *plantService) Delete(id uuid.UUID) error_utils.MessageErr {
	_, err := service.IPlantRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The plant with the id %s is not found in the database.", id.String()))
	}

	service.IPlantRepository.Delete(id)
	return nil
}
