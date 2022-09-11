package service

import (
	"fmt"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"
)

type recommendationService struct {
	IPlantRepository repository.PlantRepositoryInterface
}

type RecommendationServiceInterface interface {
	GetSimilarPlants(references []string) []float64
}

func NewRecommendationService(pr repository.PlantRepositoryInterface) RecommendationServiceInterface {
	return &recommendationService{pr}
}

func (this *recommendationService) getPlantsByReferentsIds(references []string) []data.ReferentPlant {
	return this.IPlantRepository.FindPlantsByReferentsIds(references)
}

func (this *recommendationService) calculateVectorOfUsersPlants(plants []data.ReferentPlant) []float64 {
	lightMap := make(map[int]int)
	wateringMap := make(map[int]int)
	isBloomingMap := make(map[int]int)
	growthRateMap := make(map[int]int)
	hardinessMap := make(map[int]int)
	heightMap := make(map[int]int)
	lifeTimeMap := make(map[int]int)

	for _, plant := range plants {
		lightMap = appendLightMap(plant.Light, lightMap)
		wateringMap = appendWateringMap(plant.Watering, wateringMap)
		isBloomingMap = appendIsBloomingMap(plant.IsBlooming, isBloomingMap)
		growthRateMap = appendGrowthRateMap(plant.GrowthRate, growthRateMap)
		hardinessMap = appendHardinessMap(plant.Hardiness, hardinessMap)
		heightMap = appendHeightMap(plant.Height, heightMap)
		lifeTimeMap = appendLifeTimeMap(plant.LifeTime, lifeTimeMap)
	}

	lightValue := getAverageValue(lightMap, len(plants))
	wateringValue := getAverageValue(wateringMap, len(plants))
	isBloomingValue := getAverageValue(isBloomingMap, len(plants))
	growthRateValue := getAverageValue(growthRateMap, len(plants))
	hardinessValue := getAverageValue(hardinessMap, len(plants))
	heightValue := getAverageValue(heightMap, len(plants))
	lifeTimeValue := getAverageValue(lifeTimeMap, len(plants))

	return []float64{lightValue, wateringValue, isBloomingValue, growthRateValue, hardinessValue, heightValue, lifeTimeValue}
}

func appendLifeTimeMap(plifeTime data.LifeTime, lifeTimeMap map[int]int) map[int]int {
	lifeTime := lifeTimeMap[int(plifeTime)]
	if lifeTime == 0 {
		lifeTimeMap[int(plifeTime)] = 1
	} else {
		lifeTimeMap[int(plifeTime)] = lifeTimeMap[int(plifeTime)] + 1
	}
	return lifeTimeMap
}

func appendHeightMap(pheight data.Height, heightMap map[int]int) map[int]int {
	height := heightMap[int(pheight)]
	if height == 0 {
		heightMap[int(pheight)] = 1
	} else {
		heightMap[int(pheight)] = heightMap[int(pheight)] + 1
	}
	return heightMap
}

func appendHardinessMap(phardiness data.Hardiness, hardinessMap map[int]int) map[int]int {
	hardiness := hardinessMap[int(phardiness)]
	if hardiness == 0 {
		hardinessMap[int(phardiness)] = 1
	} else {
		hardinessMap[int(phardiness)] = hardinessMap[int(phardiness)] + 1
	}
	return hardinessMap
}

func appendGrowthRateMap(pgrowthRate data.GrowthRate, growthRateMap map[int]int) map[int]int {
	growthRate := growthRateMap[int(pgrowthRate)]
	if growthRate == 0 {
		growthRateMap[int(pgrowthRate)] = 1
	} else {
		growthRateMap[int(pgrowthRate)] = growthRateMap[int(pgrowthRate)] + 1
	}
	return growthRateMap
}

func appendIsBloomingMap(b bool, isBloomingMap map[int]int) map[int]int {
	isBlooming := 0
	if b {
		isBlooming = 1
	}

	blooming := isBloomingMap[int(isBlooming)]
	if blooming == 0 {
		isBloomingMap[int(isBlooming)] = 1
	} else {
		isBloomingMap[int(isBlooming)] = isBloomingMap[int(isBlooming)] + 1
	}
	return isBloomingMap
}

func appendWateringMap(pwatering data.Watering, wateringMap map[int]int) map[int]int {
	watering := wateringMap[int(pwatering)]
	if watering == 0 {
		wateringMap[int(pwatering)] = 1
	} else {
		wateringMap[int(pwatering)] = wateringMap[int(pwatering)] + 1
	}
	return wateringMap
}

func appendLightMap(plight data.Light, lightMap map[int]int) map[int]int {
	light := lightMap[int(plight)]
	if light == 0 {
		lightMap[int(plight)] = 1
	} else {
		lightMap[int(plight)] = lightMap[int(plight)] + 1
	}
	return lightMap
}

func getAverageValue(lightMap map[int]int, denominator int) float64 {
	numerator := 0
	for key, value := range lightMap {
		fmt.Println("Key:", key, "=>", "Element:", value)
		numerator += (key * value)
	}

	fmt.Println("Numerator:", numerator)
	fmt.Println("Denominator:", denominator)

	return float64(numerator) / float64(denominator)
}

func (this *recommendationService) GetSimilarPlants(references []string) []float64 {
	plants := this.getPlantsByReferentsIds(references)
	return this.calculateVectorOfUsersPlants(plants)
}
