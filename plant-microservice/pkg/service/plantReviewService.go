package service

import (
	"fmt"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/repository"
	"plant-microservice/pkg/utils/error_utils"

	"github.com/google/uuid"
)

type plantReviewService struct {
	IPlantReviewRepository repository.PlantReviewRepositoryInterface
	IPlantService          PlantServiceInterface
}

type PlantReviewServiceInterface interface {
	GetAllByPlant(uuid.UUID) ([]dto.PlantReviewResponse, error_utils.MessageErr)
	Create(plantReviewRequest *dto.PlantReviewRequest) (*uuid.NullUUID, error_utils.MessageErr)
	Update(plantReviewUpdateRequest *dto.PlantReviewUpdateRequest, id uuid.UUID) error_utils.MessageErr
	Delete(id uuid.UUID) error_utils.MessageErr
}

func NewPlantReviewService(r repository.PlantReviewRepositoryInterface, ps PlantServiceInterface) PlantReviewServiceInterface {
	return &plantReviewService{r, ps}
}

func (service *plantReviewService) GetAllByPlant(id uuid.UUID) ([]dto.PlantReviewResponse, error_utils.MessageErr) {
	plantReviews, err := service.IPlantReviewRepository.FindAllByPlant(id)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve plants: %s", err.Error()))
	}

	plantReviewsResponse := make([]dto.PlantReviewResponse, 0)
	for _, v := range plantReviews {
		plantReviewsResponse = append(plantReviewsResponse, *dto.NewPlantReviewResponseFromPlantReview(v))
	}
	return plantReviewsResponse, nil
}

func (service *plantReviewService) Create(plantReviewRequest *dto.PlantReviewRequest) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()
	plantReview := dto.NewPlantReviewFromPlantReviewRequest(plantReviewRequest, id)

	_, msg_err := service.IPlantService.GetOneById(plantReview.PlantID)
	if msg_err != nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Plant with the id %s does not exists in the database.", plantReview.PlantID.String()))
	}

	err := service.IPlantReviewRepository.Create(plantReview)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create plant review: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (service *plantReviewService) Update(plantReviewUpdateRequest *dto.PlantReviewUpdateRequest, id uuid.UUID) error_utils.MessageErr {

	plantReview, err := service.IPlantReviewRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The plant review with the id %s is not found in the database.", id.String()))
	}
	plantReview.Comment = plantReviewUpdateRequest.Comment

	err = service.IPlantReviewRepository.Update(plantReview)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update plant review: %s", err.Error()))
	}
	return nil
}

func (service *plantReviewService) Delete(id uuid.UUID) error_utils.MessageErr {
	_, err := service.IPlantReviewRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The plant review with the id %s is not found in the database.", id.String()))
	}

	service.IPlantReviewRepository.Delete(id)
	return nil
}
