package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/service"
)

type RecommendationHandler struct {
	l                      *log.Logger
	IRecommendationService service.RecommendationServiceInterface
}

func NewRecommendationHandler(l *log.Logger, s service.RecommendationServiceInterface) *RecommendationHandler {
	return &RecommendationHandler{l, s}
}

func (this *RecommendationHandler) GetPlantsByReferentsIds(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get Plants By Referents Ids")
	w.Header().Add("Content-Type", "application/json")

	var referents dto.Referents
	err := json.NewDecoder(r.Body).Decode(&referents)
	if err != nil {
		log.Print("greska!")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	plants := this.IRecommendationService.GetSimilarPlants(referents.ReferentIds)
	// if err != nil {
	// 	http.Error(w, err.Message(), err.Status())
	// }

	json.NewEncoder(w).Encode(plants)
}
