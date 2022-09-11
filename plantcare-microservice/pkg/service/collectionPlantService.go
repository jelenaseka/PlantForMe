package service

import (
	"errors"
	"fmt"
	"plantcare-microservice/pkg/data"
	"plantcare-microservice/pkg/dto"
	"plantcare-microservice/pkg/repository"
	"plantcare-microservice/pkg/utils/error_utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type collectionPlantService struct {
	ICollectionPlantRepository repository.CollectionPlantRepositoryInterface
	ICollectionRepository      repository.CollectionRepositoryInterface
}

type CollectionPlantServiceInterface interface {
	GetAllByCollectionId(collectionId uuid.UUID) ([]dto.CollectionPlantResponse, error_utils.MessageErr)
	GetOneById(id uuid.UUID) (*dto.CollectionPlantResponse, error_utils.MessageErr)
	GetReferentPlantsIdByUsername(username string) ([]string, error_utils.MessageErr)
	Create(collectionPlantRequest *dto.CollectionPlantRequest, username string) (*uuid.NullUUID, error_utils.MessageErr)
	Update(id uuid.UUID, collectionPlantRequest *dto.CollectionPlantUpdateRequest, username string) error_utils.MessageErr
	Delete(id uuid.UUID, username string) error_utils.MessageErr
}

func NewCollectionPlantService(r repository.CollectionPlantRepositoryInterface, cr repository.CollectionRepositoryInterface) CollectionPlantServiceInterface {
	return &collectionPlantService{r, cr}
}

func (this *collectionPlantService) GetAllByCollectionId(collectionId uuid.UUID) ([]dto.CollectionPlantResponse, error_utils.MessageErr) {
	collectionPlants, err := this.ICollectionPlantRepository.FindAllByCollectionId(collectionId)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve collection plants: %s", err.Error()))
	}

	collectionPlantsResponse := make([]dto.CollectionPlantResponse, 0)
	for _, v := range collectionPlants {
		collectionPlantsResponse = append(collectionPlantsResponse, *dto.NewCollectionPlantResponse(v.ID, v.Collection, v.Nickname, v.ReferentPlantID, v.ReferentPlantName, v.Base64Image, v.Tasks))
	}

	return collectionPlantsResponse, nil
}

func (this *collectionPlantService) GetOneById(id uuid.UUID) (*dto.CollectionPlantResponse, error_utils.MessageErr) {
	collectionPlant, err := this.ICollectionPlantRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The collection plant with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve collection plant: %s", err.Error()))
		}
	}

	collectionPlantResponse := dto.NewCollectionPlantResponse(collectionPlant.ID, collectionPlant.Collection, collectionPlant.Nickname, collectionPlant.ReferentPlantID, collectionPlant.ReferentPlantName, collectionPlant.Base64Image, collectionPlant.Tasks)

	return collectionPlantResponse, nil
}

func (this *collectionPlantService) GetReferentPlantsIdByUsername(username string) ([]string, error_utils.MessageErr) {
	referentIds, err := this.ICollectionPlantRepository.FindReferentPlantsIdByUsername(username)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve referent plants: %s", err.Error()))
	}

	return referentIds, nil
}

func (this *collectionPlantService) Create(collectionPlantRequest *dto.CollectionPlantRequest, username string) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()
	collectionPlant := data.NewCollectionPlant(id, collectionPlantRequest.CollectionID, collectionPlantRequest.Nickname, collectionPlantRequest.ReferentPlantID, collectionPlantRequest.ReferentPlantName, collectionPlantRequest.Base64Image)

	collection, err := this.ICollectionRepository.FindById(collectionPlant.CollectionID)

	if collection.Username != username {
		return nil, error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	}

	err = this.ICollectionPlantRepository.Create(collectionPlant)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create collection plant: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (this *collectionPlantService) Update(id uuid.UUID, collectionPlantRequest *dto.CollectionPlantUpdateRequest, username string) error_utils.MessageErr {
	collectionPlant, err := this.ICollectionPlantRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The collection plant with the id %s is not found in the database.", id.String()))
	}

	collection, err := this.ICollectionRepository.FindById(collectionPlant.CollectionID)

	if collection.Username != username {
		return error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	}

	collectionPlant.Nickname = collectionPlantRequest.Nickname
	collectionPlant.Base64Image = collectionPlantRequest.Base64Image

	err = this.ICollectionPlantRepository.Update(collectionPlant)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update collection plant: %s", err.Error()))
	}
	return nil
}

func (this *collectionPlantService) Delete(id uuid.UUID, username string) error_utils.MessageErr {
	collectionPlant, err := this.ICollectionPlantRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The collection plant with the id %s is not found in the database.", id.String()))
	}

	collection, err := this.ICollectionRepository.FindById(collectionPlant.CollectionID)

	if collection.Username != username {
		return error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	}

	this.ICollectionPlantRepository.Delete(id)
	return nil
}
