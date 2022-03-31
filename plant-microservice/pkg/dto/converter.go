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
