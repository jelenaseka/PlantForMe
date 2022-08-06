package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/service"
	"plant-microservice/pkg/utils"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type PlantReviewHandler struct {
	l                   *log.Logger
	IPlantReviewService service.PlantReviewServiceInterface
}

func NewPlantReviewHandler(l *log.Logger, s service.PlantReviewServiceInterface) *PlantReviewHandler {
	return &PlantReviewHandler{l, s}
}

func (this *PlantReviewHandler) GetAllByPlant(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all plant reviews by plant")
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	w.Header().Add("Content-Type", "application/json")

	plantReviews, err := this.IPlantReviewService.GetAllByPlant(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(plantReviews)
}

func (this *PlantReviewHandler) GetAverageRatingByPlant(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get average rating by plant")
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	w.Header().Add("Content-Type", "application/json")

	rating, err := this.IPlantReviewService.GetAverageRatingByPlant(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(rating)

}

func (this *PlantReviewHandler) GetUserReviewByPlant(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get user review by plant")
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}
	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}
	w.Header().Add("Content-Type", "application/json")

	review, err := this.IPlantReviewService.GetUserReviewByPlant(uuid.Must(uuid.Parse(id)), username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
	if review == nil {
		w.WriteHeader(204)
	}

	json.NewEncoder(w).Encode(review)
}

func (plant *PlantReviewHandler) Create(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Create plant review on plant")

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	plantReviewRequest := r.Context().Value(ContextPlantReviewKey{}).(dto.PlantReviewRequest)
	plant.l.Printf("Plant id: %s", plantReviewRequest.PlantID)

	id, err := plant.IPlantReviewService.Create(&plantReviewRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (plant *PlantReviewHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Print("Update plant review with the id ", id)

	plantReviewRequest := r.Context().Value(ContextPlantReviewUpdateKey{}).(dto.PlantReviewUpdateRequest)

	err := plant.IPlantReviewService.Update(&plantReviewRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (plant *PlantReviewHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Print("Delete plant review with the id ", id)

	err := plant.IPlantReviewService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
