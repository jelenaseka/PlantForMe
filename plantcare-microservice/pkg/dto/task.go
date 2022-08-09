package dto

import (
	"plantcare-microservice/pkg/data"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type TaskResponse struct {
	ID                string `json:"id"`
	CollectionPlantID string `json:"collectionPlantId"`
	Type              string `json:"type"`
	Status            string `json:"status"`
	Date              string `json:"date"`
	Notes             string `json:"notes"`
}

type TaskRequest struct {
	CollectionPlantID string `json:"collectionPlantId" validate:"required"`
	Type              int    `json:"type" validate:"min=0,max=5"`
	Date              string `json:"date" validate:"required"`
	Notes             string `json:"notes"`
}

func NewTaskResponse(id uuid.UUID, collectionPlantId uuid.UUID, taskType data.TaskType, status data.TaskStatus, date time.Time, notes string) *TaskResponse {
	return &TaskResponse{
		ID:                id.String(),
		CollectionPlantID: collectionPlantId.String(),
		Type:              taskType.String(),
		Status:            status.String(),
		Date:              date.Format(time.RFC3339),
		Notes:             notes,
	}
}

func (p *TaskRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}
