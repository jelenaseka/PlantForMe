package dto

import (
	"plant-microservice/pkg/data"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type PlantReviewResponse struct {
	ID        string `json:"id" validate:"required,uuid"`
	CreatedAt string `json:"createdAt" validate:"required"`
	Comment   string `json:"comment"`
	PlantID   string `json:"plantID" validate:"required"`
}

type PlantReviewRequest struct {
	Comment string `json:"comment" validate:"required"`
	PlantID string `json:"plantID" validate:"required"`
}

type PlantReviewUpdateRequest struct {
	Comment string `json:"comment" validate:"required"`
}

func NewPlantReviewResponseFromPlantReview(plantReview data.PlantReview) *PlantReviewResponse {
	return &PlantReviewResponse{
		ID:      plantReview.ID.String(),
		Comment: plantReview.Comment,
		PlantID: string(plantReview.Plant.ID.String()),
	}
}

func NewPlantReviewFromPlantReviewRequest(plantReviewRequest *PlantReviewRequest, id uuid.UUID) *data.PlantReview {
	return &data.PlantReview{
		ID:      id,
		Comment: plantReviewRequest.Comment,
		PlantID: uuid.Must(uuid.Parse(plantReviewRequest.PlantID)),
	}
}

func (p *PlantReviewRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}

func (p *PlantReviewUpdateRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}
