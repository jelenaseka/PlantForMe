package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/service"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type Plant struct {
	l             *log.Logger
	IPlantService service.PlantServiceInterface
}

func NewPlantHandler(l *log.Logger, s service.PlantServiceInterface) *Plant {
	return &Plant{l, s}
}

func (plant *Plant) GetAll(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Get all plants")

	w.Header().Add("Content-Type", "application/json")

	plants, err := plant.IPlantService.GetAll()
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(plants)
}

func (plant *Plant) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Println("Get plant with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	plantResponse, err := plant.IPlantService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(plantResponse)
}

func (plant *Plant) Create(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Create plant")

	plantRequest := r.Context().Value(ContextPlantKey{}).(dto.PlantRequest)

	id, err := plant.IPlantService.Create(&plantRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (plant *Plant) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Print("Update plant with the id ", id)

	plantRequest := r.Context().Value(ContextPlantKey{}).(dto.PlantRequest)

	err := plant.IPlantService.Update(&plantRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (plant *Plant) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Print("Delete plant with the id ", id)

	err := plant.IPlantService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
