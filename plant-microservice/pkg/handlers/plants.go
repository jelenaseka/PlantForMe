package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"plant-microservice/pkg/dto"
	"plant-microservice/pkg/errors"
	"plant-microservice/pkg/service"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type Plant struct {
	l            *log.Logger
	PlantService *service.PlantService
}

func NewPlantHandler(l *log.Logger, s *service.PlantService) *Plant {
	return &Plant{l, s}
}

func (plant *Plant) GetAll(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Get all plants")

	w.Header().Add("Content-Type", "application/json")
	plants, err := plant.PlantService.GetAll()

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err)
	}

	json.NewEncoder(w).Encode(plants)
}

func (plant *Plant) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	plant.l.Println("Get plant with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	plantResponse, err := plant.PlantService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
	json.NewEncoder(w).Encode(plantResponse)
}

func (plant *Plant) Create(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Create plant")

	plantRequest := r.Context().Value(ContextPlantKey{}).(dto.PlantRequest)

	id, err := plant.PlantService.Create(&plantRequest)
	if err != nil {
		switch err.(type) {
		case *errors.AlreadyExistsException:
			http.Error(w, err.Error(), http.StatusConflict)
		case *errors.NotExistsException:
			http.Error(w, err.Error(), http.StatusNotFound)
		default:
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	json.NewEncoder(w).Encode(id)
}

func (plant *Plant) Update(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Update plant")
}

func (plant *Plant) Delete(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Delete plant")
}
