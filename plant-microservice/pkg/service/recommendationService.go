package service

import (
	"fmt"
	"log"
	"math"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/repository"
	"plant-microservice/pkg/utils/error_utils"
	"sort"
)

type recommendationService struct {
	IPlantRepository repository.PlantRepositoryInterface
}

type RecommendationServiceInterface interface {
	GetSimilarPlants(references []string) ([]data.Plant, error_utils.MessageErr)
}

func NewRecommendationService(pr repository.PlantRepositoryInterface) RecommendationServiceInterface {
	return &recommendationService{pr}
}

func (this *recommendationService) GetSimilarPlants(references []string) ([]data.Plant, error_utils.MessageErr) {
	fmt.Println("Get similar plants in service")
	fmt.Println("references: ", references)
	plants := this.getPlantsByReferentsIds(references)
	userPlantsVector := this.calculateVectorOfUsersPlants(plants)

	allPlants, err := this.IPlantRepository.FindAllReferentPlants()
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve plants: %s", err.Error()))
	}

	similarityMap := make(map[string]float64)
	for _, v := range allPlants {
		plantVector := findVectorForPlant(v)

		fmt.Println("user vector: ", userPlantsVector)
		fmt.Println("plant vector: ", plantVector)

		euclSimilarity := calculateEuclideanDistanceBasedSimilarity(userPlantsVector, plantVector)
		similarityMap[v.ID.String()] = euclSimilarity
		log.Printf("id: %s, sim: %f", v.ID.String(), euclSimilarity)
	}

	keys := sortSimilarityMapAndReturn10Keys(similarityMap)

	for _, k := range keys {
		fmt.Println(k, similarityMap[k])
	}

	resultPlants := this.IPlantRepository.FindPlantsByIds(keys)

	return resultPlants, nil
}

func sortSimilarityMapAndReturn10Keys(similarityMap map[string]float64) []string {
	keys := make([]string, 0, len(similarityMap))

	for key := range similarityMap {
		keys = append(keys, key)
	}
	sort.SliceStable(keys, func(i, j int) bool {
		return similarityMap[keys[i]] > similarityMap[keys[j]]
	})

	return keys[0:10]
}

func calculateEuclideanDistanceBasedSimilarity(userPlantsVector []float64, plantVector []float64) float64 {
	sum := 0.0
	for i := 0; i < len(userPlantsVector); i++ {
		upv := userPlantsVector[i]
		pv := plantVector[i]

		sum += math.Pow((upv - pv), 2)
	}

	sumSquareRoot := math.Sqrt(sum)
	fmt.Println("sumSquareRoot:", sumSquareRoot)

	distance := 1 / (1 + sumSquareRoot)
	return distance
}

func calculateCosineSimilarity(userPlantsVector []float64, plantVector []float64) float64 {
	numerator := 0.0
	uSquared := 0.0
	pSquared := 0.0
	var denominator float64

	for i := 0; i < len(userPlantsVector); i++ {
		upv10 := userPlantsVector[i]
		pv10 := plantVector[i]

		numerator += upv10 * pv10
		uSquared += math.Pow(upv10, 2)
		pSquared += math.Pow(pv10, 2)
	}

	uSquareRoot := math.Sqrt(uSquared)
	pSquareRoot := math.Sqrt(pSquared)
	denominator = uSquareRoot * pSquareRoot

	cosineSimilarity := numerator / denominator

	fmt.Println("Numerator:", numerator)
	fmt.Println("uSquareRoot:", uSquareRoot)
	fmt.Println("pSquareRoot:", pSquareRoot)
	fmt.Println("Denominator:", denominator)
	fmt.Println("cosine sim: ", cosineSimilarity)
	return cosineSimilarity
}

func findVectorForPlant(plant data.ReferentPlant) []float64 {
	isBloomingValue := 1
	if plant.IsBlooming {
		isBloomingValue = 2
	}

	return []float64{float64(plant.Light + 1), float64(plant.Watering + 1), float64(isBloomingValue), float64(plant.GrowthRate + 1),
		float64(plant.Hardiness + 1), float64(plant.Height + 1), float64(plant.LifeTime + 1)}
}

func (this *recommendationService) getPlantsByReferentsIds(references []string) []data.ReferentPlant {
	return this.IPlantRepository.FindReferentPlantsByReferentsIds(references)
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
		lightMap = appendLightMap(plant.Light+1, lightMap)
		wateringMap = appendWateringMap(plant.Watering+1, wateringMap)
		isBloomingMap = appendIsBloomingMap(plant.IsBlooming, isBloomingMap)
		growthRateMap = appendGrowthRateMap(plant.GrowthRate+1, growthRateMap)
		hardinessMap = appendHardinessMap(plant.Hardiness+1, hardinessMap)
		heightMap = appendHeightMap(plant.Height+1, heightMap)
		lifeTimeMap = appendLifeTimeMap(plant.LifeTime+1, lifeTimeMap)
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
	isBlooming := 1
	if b {
		isBlooming = 2
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
