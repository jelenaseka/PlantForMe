package dto

import "plant-microservice/pkg/data"

func ConvertPlantToPlantResponse(plant *data.Plant) *PlantResponse {
	return NewPlantResponse(
		plant.ID.String(),
		plant.Name,
		plant.Description,
		plant.CategoryID.String(),
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
