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
	Username  string `json:"username"`
	Rating    int    `json:"rating"`
}

type PlantReviewRequest struct {
	Comment string `json:"comment" validate:"required"`
	PlantID string `json:"plantID" validate:"required"`
	Rating  int    `json:"rating" validate:"required,min=0,max=5"`
}

type PlantReviewUpdateRequest struct {
	Comment string `json:"comment" validate:"required"`
	Rating  int    `json:"rating" validate:"required,min=0,max=5"`
}

func NewPlantReviewResponseFromPlantReview(plantReview data.PlantReview) *PlantReviewResponse {
	return &PlantReviewResponse{
		ID:       plantReview.ID.String(),
		Comment:  plantReview.Comment,
		PlantID:  string(plantReview.Plant.ID.String()),
		Username: plantReview.Username,
		Rating:   plantReview.Rating,
	}
}

func NewPlantReviewFromPlantReviewRequest(plantReviewRequest *PlantReviewRequest, id uuid.UUID, username string) *data.PlantReview {
	return &data.PlantReview{
		ID:       id,
		Comment:  plantReviewRequest.Comment,
		PlantID:  uuid.Must(uuid.Parse(plantReviewRequest.PlantID)),
		Username: username,
		Rating:   plantReviewRequest.Rating,
	}
}

// func NewPlantReviewResponse(id uuid.UUID, comment string, plantID uuid.UUID, username string, rating int) *PlantReviewResponse {
// 	return &PlantReviewResponse{
// 		ID:       id.String(),
// 		Comment:  comment,
// 		PlantID:  plantID.String(),
// 		Username: username,
// 		Rating:   rating,
// 	}
// }

func (p *PlantReviewRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}

func (p *PlantReviewUpdateRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}
