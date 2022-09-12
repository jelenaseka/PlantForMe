package dto

import "github.com/google/uuid"

type Referents struct {
	ReferentIds []string `json:"referentIds"`
}

type Plant struct {
	ID          uuid.UUID `gorm:"type:varchar(36)"`
	Name        string    `gorm:"type:varchar(255);unique"`
	Description string
	Base64Image string
	Light       Light
	Watering    Watering
	IsBlooming  bool
	GrowthRate  GrowthRate
	Hardiness   Hardiness
	Height      Height
	LifeTime    LifeTime
}

type Light int

const (
	Direct Light = iota
	Indirect
	PartialShade
	Shade
)

type GrowthRate int

const (
	FastGrowing GrowthRate = iota
	MediumGrowing
	SlowGrowing
)

type Watering int

const (
	Daily Watering = iota
	TwiceAWeek
	OnceAWeek
	TwiceAMonth
	OnceAMonth
)

type Hardiness int

const (
	Tender Hardiness = iota
	HalfHardy
	Hardy
)

type Height int

const (
	Tiny Height = iota
	Small
	Medium
	Tall
)

type LifeTime int

const (
	Annuals LifeTime = iota
	Beinnials
	Perennials
)
