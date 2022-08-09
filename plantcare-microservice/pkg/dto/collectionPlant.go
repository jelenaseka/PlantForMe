package dto

import (
	"plantcare-microservice/pkg/data"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type CollectionPlantResponse struct {
	ID              string         `json:"id"`
	CollectionID    string         `json:"collectionId"`
	Nickname        string         `json:"nickname"`
	ReferentPlantID string         `json:"referentPlantId"`
	Base64Image     string         `json:"base64Image"`
	Tasks           []TaskResponse `json:"tasks"`
}

type CollectionPlantRequest struct {
	CollectionID    string `json:"collectionId" validate:"required"`
	Nickname        string `json:"nickname" validate:"required"`
	ReferentPlantID string `json:"referentPlantId" validate:"required"`
	Base64Image     string `json:"base64Image"`
}

type CollectionPlantUpdateRequest struct {
	Nickname    string `json:"nickname" validate:"required"`
	Base64Image string `json:"base64Image"`
}

func NewCollectionPlantResponse(id uuid.UUID, collectionId uuid.UUID, nickname string, referentPlantId uuid.UUID, base64 string, tasks []data.Task) *CollectionPlantResponse {
	tasksDTO := make([]TaskResponse, 0)
	return &CollectionPlantResponse{
		ID:              id.String(),
		CollectionID:    collectionId.String(),
		Nickname:        nickname,
		ReferentPlantID: referentPlantId.String(),
		Base64Image:     base64,
		Tasks:           tasksDTO,
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
