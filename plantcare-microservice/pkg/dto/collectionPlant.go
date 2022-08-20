package dto

import (
	"plantcare-microservice/pkg/data"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type CollectionPlantResponse struct {
	ID                string             `json:"id"`
	CollectionID      string             `json:"collectionId"`
	Collection        CollectionResponse `json:"collection"`
	Nickname          string             `json:"nickname"`
	ReferentPlantID   string             `json:"referentPlantId"`
	ReferentPlantName string             `json:"referentPlantName"`
	Base64Image       string             `json:"base64Image"`
	Tasks             []TaskResponse     `json:"tasks"`
}

type CollectionPlantRequest struct {
	CollectionID      string `json:"collectionId" validate:"required"`
	Nickname          string `json:"nickname" validate:"required"`
	ReferentPlantID   string `json:"referentPlantId" validate:"required"`
	ReferentPlantName string `json:"referentPlantName" validate:"required"`
	Base64Image       string `json:"base64Image"`
}

type CollectionPlantUpdateRequest struct {
	Nickname    string `json:"nickname" validate:"required"`
	Base64Image string `json:"base64Image"`
}

func NewCollectionPlantResponse(id uuid.UUID, collection data.Collection, nickname string, referentPlantId uuid.UUID, referentPlantName string, base64 string, tasks []data.Task) *CollectionPlantResponse {
	tasksDTO := make([]TaskResponse, 0)
	for _, v := range tasks {
		tasksDTO = append(tasksDTO, *NewTaskResponse(v.ID, v.CollectionPlantID, v.Type, v.Status, v.Date, v.Notes))
	}
	collectionResponse := CollectionResponse{
		ID:               collection.ID.String(),
		Name:             collection.Name,
		Description:      collection.Description,
		CollectionPlants: nil,
		Username:         collection.Username,
	}
	return &CollectionPlantResponse{
		ID:                id.String(),
		CollectionID:      collection.ID.String(),
		Collection:        collectionResponse,
		Nickname:          nickname,
		ReferentPlantID:   referentPlantId.String(),
		ReferentPlantName: referentPlantName,
		Base64Image:       base64,
		Tasks:             tasksDTO,
	}
}

func (p *CollectionPlantRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}

func (p *CollectionPlantUpdateRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}
