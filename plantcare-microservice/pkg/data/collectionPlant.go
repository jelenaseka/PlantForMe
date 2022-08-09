package data

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CollectionPlant struct {
	gorm.Model
	ID              uuid.UUID
	CollectionID    uuid.UUID
	Nickname        string
	ReferentPlantID uuid.UUID
	Base64Image     string
	Tasks           []Task
}

func NewCollectionPlant(id uuid.UUID, collectionId string, nickname string, referentPlantId string, base64 string) *CollectionPlant {
	return &CollectionPlant{
		ID:              id,
		CollectionID:    uuid.Must(uuid.Parse(collectionId)),
		Nickname:        nickname,
		ReferentPlantID: uuid.Must(uuid.Parse(referentPlantId)),
		Base64Image:     base64,
	}
}
