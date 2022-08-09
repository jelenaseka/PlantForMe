package dto

import (
	"plantcare-microservice/pkg/data"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type CollectionRequest struct {
	Name        string `json:"name" validate:"required,min=3,max=45"`
	Description string `json:"description" validate:"required,max=255"`
}

type CollectionUpdateRequest struct {
	Name        string `json:"name" validate:"min=3,max=45"`
	Description string `json:"description" validate:"max=255"`
}

type CollectionResponse struct {
	ID               string                    `json:"id"`
	Name             string                    `json:"name"`
	Description      string                    `json:"description"`
	CollectionPlants []CollectionPlantResponse `json:"collectionPlants"`
	Username         string                    `json:"username"`
}

func NewCollectionResponse(id uuid.UUID, name string, description string, collectionPlants []data.CollectionPlant, username string) *CollectionResponse {
	//dto
	collectionPlantsDTO := make([]CollectionPlantResponse, 0) //TODO
	return &CollectionResponse{
		ID:               id.String(),
		Name:             name,
		Description:      description,
		CollectionPlants: collectionPlantsDTO,
		Username:         username,
	}
}

func (p *CollectionRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}

func (p *CollectionUpdateRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}
