package data

import (
	"time"

	"github.com/google/uuid"
)

type Plant struct {
	ID             uuid.UUID  `json:"id"`
	Name           string     `json:"name" validate:"required"`
	Description    string     `json:"description" validate:"required"`
	CategoryId     uuid.UUID  `json:"categoryId"`
	Light          Light      `json:"light"`
	Watering       Watering   `json:"watering"`
	IsBlooming     bool       `json:"isBlooming"`
	BloomingMonths []Month    `json:"bloomingMonths"`
	GrowthRate     GrowthRate `json:"growthRate" validate:"required"`
	Hardiness      Hardiness  `json:"hardiness" validate:"required"`
	Height         Height     `json:"height" validate:"required"`
	LifeTime       LifeTime   `json:"lifeTime" validate:"required"`
	CreatedOn      time.Time  `json:"createdOn"`
}
