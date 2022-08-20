package dto

import (
	"plant-microservice/pkg/data"
	"time"

	"github.com/go-playground/validator/v10"
)

type PlantRequest struct {
	Name           string `json:"name" validate:"required,min=3,max=50"`
	Description    string `json:"description" validate:"required,min=3,max=10000"`
	Image          string `json:"image"`
	CategoryID     string `json:"categoryId" validate:"required,uuid"`
	Light          int    `json:"light" validate:"min=0,max=3"`
	Watering       int    `json:"watering" validate:"min=0,max=4"`
	IsBlooming     bool   `json:"isBlooming"`
	BloomingMonths []int  `json:"bloomingMonths" validate:"required,unique,dive,min=0,max=11"`
	GrowthRate     int    `json:"growthRate" validate:"min=0,max=2"`
	Hardiness      int    `json:"hardiness" validate:"min=0,max=2"`
	Height         int    `json:"height" validate:"min=0,max=3"`
	LifeTime       int    `json:"lifeTime" validate:"min=0,max=2"`
}

type PlantResponse struct {
	ID             string               `json:"id" validate:"required,uuid"`
	Name           string               `json:"name" validate:"required"`
	Description    string               `json:"description" validate:"required"`
	Image          string               `json:"image"`
	CategoryID     string               `json:"categoryID" validate:"required"`
	Light          data.Light           `json:"light" validate:"required"`
	Watering       data.Watering        `json:"watering" validate:"required"`
	IsBlooming     bool                 `json:"isBlooming" validate:"required"`
	BloomingMonths []data.BloomingMonth `json:"bloomingMonths" validate:"required,unique,dive,min=0,max=11"`
	GrowthRate     data.GrowthRate      `json:"growthRate" validate:"required"`
	Hardiness      data.Hardiness       `json:"hardiness" validate:"required"`
	Height         data.Height          `json:"height" validate:"required"`
	LifeTime       data.LifeTime        `json:"lifeTime" validate:"required"`
	CreatedAt      string               `json:"createdAt" validate:"required"`
}

type PlantResponseWithCategory struct {
	ID             string               `json:"id" validate:"required,uuid"`
	Name           string               `json:"name" validate:"required"`
	Description    string               `json:"description" validate:"required"`
	Image          string               `json:"image"`
	Category       CategoryResponse     `json:"category" validate:"required"`
	Light          data.Light           `json:"light" validate:"required"`
	Watering       data.Watering        `json:"watering" validate:"required"`
	IsBlooming     bool                 `json:"isBlooming" validate:"required"`
	BloomingMonths []data.BloomingMonth `json:"bloomingMonths" validate:"required,unique,dive,min=0,max=11"`
	GrowthRate     data.GrowthRate      `json:"growthRate" validate:"required"`
	Hardiness      data.Hardiness       `json:"hardiness" validate:"required"`
	Height         data.Height          `json:"height" validate:"required"`
	LifeTime       data.LifeTime        `json:"lifeTime" validate:"required"`
	CreatedAt      string               `json:"createdAt" validate:"required"`
}

func NewPlantResponseWithCategory(id string, name string, description string, image string, category data.Category, light data.Light, watering data.Watering,
	isBlooming bool, bloomingMonths []data.BloomingMonth, growthRate data.GrowthRate, hardiness data.Hardiness, height data.Height,
	lifeTime data.LifeTime, createdAt string) *PlantResponseWithCategory {

	categoryResponse := CategoryResponse{
		ID:   category.ID.String(),
		Name: category.Name,
	}
	return &PlantResponseWithCategory{
		ID:             id,
		Name:           name,
		Description:    description,
		Image:          image,
		Category:       categoryResponse,
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

func NewPlantResponse(id string, name string, description string, image string, category data.Category, light data.Light, watering data.Watering,
	isBlooming bool, bloomingMonths []data.BloomingMonth, growthRate data.GrowthRate, hardiness data.Hardiness, height data.Height,
	lifeTime data.LifeTime, createdAt string) *PlantResponse {

	return &PlantResponse{
		ID:             id,
		Name:           name,
		Description:    description,
		Image:          image,
		CategoryID:     category.ID.String(),
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

func NewPlantResponseFromPlant(plant data.Plant) *PlantResponse {
	// categoryResponse := CategoryResponse{
	// 	ID:   plant.Category.ID.String(),
	// 	Name: plant.Category.Name,
	// }

	return &PlantResponse{
		ID:             plant.ID.String(),
		Name:           plant.Name,
		Description:    plant.Description,
		Image:          plant.Base64Image,
		CategoryID:     plant.Category.ID.String(),
		Light:          plant.Light,
		Watering:       plant.Watering,
		IsBlooming:     plant.IsBlooming,
		BloomingMonths: plant.BloomingMonths,
		GrowthRate:     plant.GrowthRate,
		Hardiness:      plant.Hardiness,
		Height:         plant.Height,
		LifeTime:       plant.LifeTime,
		CreatedAt:      plant.CreatedAt.Format(time.RFC3339),
	}
}

func (p *PlantRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(p)
}

// func IsValidUUID(u string) bool {
// 	_, err := uuid.Parse(u)
// 	return err == nil
// }
