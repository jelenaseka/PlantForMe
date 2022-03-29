package service

import (
	"errors"
	"fmt"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/repository"
	"plant-microservice/pkg/utils/error_utils"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PlantService struct {
	PlantRepository      *repository.PlantRepository
	CategoryService      *CategoryService
	BloomingMonthService *BloomingMonthService
}

func NewPlantService(r *repository.PlantRepository, c *CategoryService, bm *BloomingMonthService) *PlantService {
	return &PlantService{r, c, bm}
}

func (service *PlantService) GetAll() ([]data.Plant, error_utils.MessageErr) {
	plants, err := service.PlantRepository.GetAll()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to prepare message: %s", err.Error()))
	}

	return plants, nil
}

func (service *PlantService) GetOneById(id uuid.UUID) (*dto.PlantResponse, error_utils.MessageErr) {
	plant, err := service.PlantRepository.FindById(id)
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

func (service *PlantService) Create(plantRequest *dto.PlantRequest) (*uuid.NullUUID, error) {
	id := uuid.New()
	bloomMonths := service.BloomingMonthService.FindByMonths(plantRequest.BloomingMonths)

	plant := data.NewPlant(
		id,
		plantRequest.Name,
		plantRequest.Description,
		uuid.Must(uuid.Parse(plantRequest.CategoryID)),
		data.Light(plantRequest.Light),
		data.Watering(plantRequest.Watering),
		plantRequest.IsBlooming,
		bloomMonths,
		data.GrowthRate(plantRequest.GrowthRate),
		data.Hardiness(plantRequest.Hardiness),
		data.Height(plantRequest.Height),
		data.LifeTime(plantRequest.LifeTime),
		time.Now(),
	)
	err := plant.Validate()

	if err != nil {
		return nil, err
	}

	foundPlant, err := service.PlantRepository.FindByName(plant.Name)
	if foundPlant != nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Plant with the name %s already exists in the database.", plant.Name))
	}

	category, err := service.CategoryService.GetOneById(plant.CategoryID)
	if category == nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Category with the id %s does not exists in the database.", plant.CategoryID.String()))
	}

	err = service.PlantRepository.Create(plant)
	if err != nil {
		// return nil, error_formats.ParseError(getError)
		return nil, err
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}
