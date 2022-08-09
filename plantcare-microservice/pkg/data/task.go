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
