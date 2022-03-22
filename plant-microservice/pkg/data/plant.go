package data

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Plant struct {
	gorm.Model
	ID             uuid.UUID       `gorm:"type:varchar(36)"`
	Name           string          `gorm:"type:varchar(255);unique" json:"name" validate:"required"`
	Description    string          `gorm:"type:varchar(2500)" json:"description" validate:"required"`
	CategoryID     uuid.UUID       `gorm:"type:varchar(36)" json:"categoryId"`
	Category       Category        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Light          Light           `json:"light"`
	Watering       Watering        `json:"watering"`
	IsBlooming     bool            `json:"isBlooming"`
	BloomingMonths []BloomingMonth `gorm:"many2many:plant_blooming_months;" json:"bloomingMonths"`
	GrowthRate     GrowthRate      `json:"growthRate" validate:"required"`
	Hardiness      Hardiness       `json:"hardiness" validate:"required"`
	Height         Height          `json:"height" validate:"required"`
	LifeTime       LifeTime        `json:"lifeTime" validate:"required"`
	CreatedAt      time.Time       `json:"createdOn"`
}

func (p Plant) String() string {
	out, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}

	return string(out)
}
