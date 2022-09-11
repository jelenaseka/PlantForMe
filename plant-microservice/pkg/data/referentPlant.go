package data

import "github.com/google/uuid"

type ReferentPlant struct {
	// gorm.Model
	ID           uuid.UUID `gorm:"type:varchar(36)"`
	CategoryName string
	Light        Light
	Watering     Watering
	IsBlooming   bool
	GrowthRate   GrowthRate
	Hardiness    Hardiness
	Height       Height
	LifeTime     LifeTime
}
