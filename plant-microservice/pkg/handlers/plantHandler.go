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

type Plant struct {
	l             *log.Logger
	IPlantService service.PlantServiceInterface
}

func NewPlantHandler(l *log.Logger, s service.PlantServiceInterface) *Plant {
	return &Plant{l, s}
}

func (this *Plant) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all plants")
	values := r.URL.Query()

	w.Header().Add("Content-Type", "application/json")

	plants, err := this.IPlantService.GetAll(values)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(plants)
}

func (plant *Plant) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

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
