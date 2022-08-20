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
	ILogsService  service.LogsServiceInterface
}

func NewPlantHandler(l *log.Logger, s service.PlantServiceInterface, ls service.LogsServiceInterface) *Plant {
	return &Plant{l, s, ls}
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

	plantResponse, err := plant.IPlantService.GetOne(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(plantResponse)
}

func (plant *Plant) GetOneWithCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	plant.l.Println("Get plant with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	plantResponse, err := plant.IPlantService.GetOneWithCategory(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(plantResponse)
}

func (plant *Plant) Create(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Create plant")

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	plantRequest := r.Context().Value(ContextPlantKey{}).(dto.PlantRequest)

	id, err := plant.IPlantService.Create(&plantRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	logLine := plant.ILogsService.CreateLogLine(username, "CREATE_PLANT", id.UUID)
	plant.ILogsService.Log(logLine)

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (plant *Plant) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Print("Update plant with the id ", id)

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	plantRequest := r.Context().Value(ContextPlantKey{}).(dto.PlantRequest)

	err := plant.IPlantService.Update(&plantRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	logLine := plant.ILogsService.CreateLogLine(username, "UPDATE_PLANT", uuid.MustParse(id))
	plant.ILogsService.Log(logLine)
}

func (plant *Plant) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	plant.l.Print("Delete plant with the id ", id)

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	err := plant.IPlantService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	logLine := plant.ILogsService.CreateLogLine(username, "DELETE_PLANT", uuid.MustParse(id))
	plant.ILogsService.Log(logLine)

	w.WriteHeader(http.StatusNoContent)
}
