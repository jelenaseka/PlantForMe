package data

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Plant struct {
	gorm.Model
	ID             uuid.UUID `gorm:"type:varchar(36)"`
	Name           string    `gorm:"type:varchar(255);unique"`
	Description    string    `gorm:"type:varchar(2500)"`
	CategoryID     uuid.UUID `gorm:"type:varchar(36)"`
	Category       Category  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Light          Light
	Watering       Watering
	IsBlooming     bool
	BloomingMonths []BloomingMonth `gorm:"many2many:plant_blooming_months;"`
	GrowthRate     GrowthRate
	Hardiness      Hardiness
	Height         Height
	LifeTime       LifeTime
	CreatedAt      time.Time
}

func NewPlant(id uuid.UUID, name string, description string, categoryID uuid.UUID, light Light, watering Watering,
	isBlooming bool, bloomingMonths []BloomingMonth, growthRate GrowthRate, hardiness Hardiness, height Height,
	lifeTime LifeTime, createdAt time.Time) *Plant {
	return &Plant{
		ID:             id,
		Name:           name,
		Description:    description,
		CategoryID:     categoryID,
		Light:          light,
		Watering:       watering,
		IsBlooming:     isBlooming,
		BloomingMonths: bloomingMonths,
		GrowthRate:     growthRate,
		Hardiness:      hardiness,
		Height:         height,
		LifeTime:       lifeTime,
		CreatedAt:      createdAt,
	}
}

func (p *Plant) String() string {
	out, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}

	return string(out)
}

func (p *Plant) Validate() error {
	// TODO
	return nil
}
