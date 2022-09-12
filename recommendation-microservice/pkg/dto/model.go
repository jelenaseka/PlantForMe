package dto

import "github.com/google/uuid"

type Referents struct {
	ReferentIds []string `json:"referentIds"`
}

type Plant struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
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
