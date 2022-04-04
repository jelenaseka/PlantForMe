package dto

import (
	"plant-microservice/pkg/data"
	"time"

	"github.com/google/uuid"
)

func ConvertPlantToPlantResponse(plant *data.Plant) *PlantResponse {
	return NewPlantResponse(
		plant.ID.String(),
		plant.Name,
		plant.Description,
		plant.Base64Image,
		plant.Category,
		plant.Light,
		plant.Watering,
		plant.IsBlooming,
		plant.BloomingMonths,
		plant.GrowthRate,
		plant.Hardiness,
		plant.Height,
		plant.LifeTime,
		plant.CreatedAt.String(),
	)
}

func ConvertPlantRequestToPlant(plantRequest *PlantRequest, bloomMonths []data.BloomingMonth, id uuid.UUID) *data.Plant {
	return data.NewPlant(
		id,
		plantRequest.Name,
		plantRequest.Description,
		plantRequest.Image,
		uuid.Must(uuid.Parse(plantRequest.CategoryID)),
		data.Light(plantRequest.Light),
		data.Watering(plantRequest.Watering),
		plantRequest.IsBlooming,
		bloomMonths,
		data.GrowthRate(plantRequest.GrowthRate),
		data.Hardiness(plantRequest.Hardiness),
		data.Height(plantRequest.Height),
		data.LifeTime(plantRequest.LifeTime),
		time.Now(),
	)
}

func ConvertCategoryToCategoryResponse(cat *data.Category) *CategoryResponse {
	return NewCategoryResponse(cat.ID.String(), cat.Name)
}
