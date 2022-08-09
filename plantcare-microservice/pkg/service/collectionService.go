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

type collectionService struct {
	ICollectionRepository repository.CollectionRepositoryInterface
}

type CollectionServiceInterface interface {
	GetAll() ([]dto.CollectionResponse, error_utils.MessageErr)
	GetAllByUsername(username string) ([]dto.CollectionResponse, error_utils.MessageErr)
	GetOneById(id uuid.UUID) (*dto.CollectionResponse, error_utils.MessageErr)
	Create(collectionRequest *dto.CollectionRequest, username string) (*uuid.NullUUID, error_utils.MessageErr)
	Update(id uuid.UUID, collectionRequest *dto.CollectionUpdateRequest, username string) error_utils.MessageErr
	Delete(id uuid.UUID, username string) error_utils.MessageErr
}

func NewCollectionService(r repository.CollectionRepositoryInterface) CollectionServiceInterface {
	return &collectionService{r}
}

func (this *collectionService) GetAll() ([]dto.CollectionResponse, error_utils.MessageErr) {
	collections, err := this.ICollectionRepository.FindAll()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve collections: %s", err.Error()))
	}

	collectionsResponse := make([]dto.CollectionResponse, 0)
	for _, v := range collections {
		collectionsResponse = append(collectionsResponse, *dto.NewCollectionResponse(v.ID, v.Name, v.Description, v.CollectionPlants, v.Username))
	}

	return collectionsResponse, nil
}

func (this *collectionService) GetAllByUsername(username string) ([]dto.CollectionResponse, error_utils.MessageErr) {
	collections, err := this.ICollectionRepository.FindAllByUsername(username)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve collections: %s", err.Error()))
	}

	collectionsResponse := make([]dto.CollectionResponse, 0)
	for _, v := range collections {
		collectionsResponse = append(collectionsResponse, *dto.NewCollectionResponse(v.ID, v.Name, v.Description, v.CollectionPlants, v.Username))
	}

	return collectionsResponse, nil
}

func (this *collectionService) GetOneById(id uuid.UUID) (*dto.CollectionResponse, error_utils.MessageErr) {
	collection, err := this.ICollectionRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The collection with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve collections: %s", err.Error()))
		}
	}

	collectionResponse := dto.NewCollectionResponse(collection.ID, collection.Name, collection.Description, collection.CollectionPlants, collection.Username)

	return collectionResponse, nil
}

func (this *collectionService) Create(collectionRequest *dto.CollectionRequest, username string) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()
	collection := data.NewCollection(id, collectionRequest.Name, collectionRequest.Description, username)

	_, err := this.ICollectionRepository.FindByName(collection.Name)
	if err == nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Collection with the name %s already exists in the database.", collection.Name))
	}

	err = this.ICollectionRepository.Create(collection)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create collection: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (this *collectionService) Update(id uuid.UUID, collectionRequest *dto.CollectionUpdateRequest, username string) error_utils.MessageErr {
	collection, err := this.ICollectionRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The collection with the id %s is not found in the database.", id.String()))
	}

	if collection.Username != username {
		return error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	}

	foundCollection, err := this.ICollectionRepository.FindByName(collectionRequest.Name)
	if err == nil && foundCollection.ID != id {
		return error_utils.NewConflictError(fmt.Sprintf("Collection with the name %s already exists in the database.", collectionRequest.Name))
	}

	collection.Name = collectionRequest.Name
	collection.Description = collectionRequest.Description

	err = this.ICollectionRepository.Update(collection)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update collection: %s", err.Error()))
	}
	return nil
}

func (this *collectionService) Delete(id uuid.UUID, username string) error_utils.MessageErr {
	collection, err := this.ICollectionRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The collection with the id %s is not found in the database.", id.String()))
	}
	if collection.Username != username {
		return error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	}

	this.ICollectionRepository.Delete(id)
	return nil
}
