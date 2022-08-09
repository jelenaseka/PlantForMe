package data

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	ID                uuid.UUID
	CollectionPlantID uuid.UUID
	Type              TaskType
	Status            TaskStatus
	Date              time.Time
	Notes             string
}

func NewTask(id uuid.UUID, collectionPlantId uuid.UUID, taskType int, status TaskStatus, date string, notes string) *Task {
	layout := "2006-01-02T15:04:05.000Z"
	myDate, err := time.Parse(layout, date)
	if err != nil {
		panic(err)
	}
	return &Task{
		ID:                id,
		CollectionPlantID: collectionPlantId,
		Type:              TaskType(taskType),
		Status:            status,
		Date:              myDate,
		Notes:             notes,
	}
}
