package data

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PlantReview struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:varchar(36)"`
	Comment   string    `gorm:"type:varchar(500)"`
	Plant     Plant
	PlantID   uuid.UUID `gorm:"type:varchar(36)"`
	CreatedAt time.Time
}

func (p *PlantReview) String() string {
	out, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}

	return string(out)
}
