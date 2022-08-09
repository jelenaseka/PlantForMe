package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"plantcare-microservice/pkg/dto"
	"plantcare-microservice/pkg/service"
	"plantcare-microservice/pkg/utils"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type CollectionPlantHandler struct {
	l                       *log.Logger
	ICollectionPlantService service.CollectionPlantServiceInterface
}

func NewCollectionPlantHandler(l *log.Logger, s service.CollectionPlantServiceInterface) *CollectionPlantHandler {
	return &CollectionPlantHandler{l, s}
}

func (this *CollectionPlantHandler) GetAllByCollectionId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Get all collection plants")

	collectionPlants, err := this.ICollectionPlantService.GetAllByCollectionId(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(collectionPlants)
}

func (this *CollectionPlantHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Println("Get collection plant with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	collectionResponse, err := this.ICollectionPlantService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(collectionResponse)
}

func (this *CollectionPlantHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create collection plant")

	headers := r.Header
	_, ok := headers["Username"]
	if !ok {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}
	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	collectionPlantRequest := r.Context().Value(ContextCollectionPlantKey{}).(dto.CollectionPlantRequest)

	id, err := this.ICollectionPlantService.Create(&collectionPlantRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *CollectionPlantHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Update collection plant with the id ", id)

	headers := r.Header
	_, ok := headers["Username"]
	if !ok {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}
	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	collectionPlantRequest := r.Context().Value(ContextCollectionPlantUpdateKey{}).(dto.CollectionPlantUpdateRequest)

	err := this.ICollectionPlantService.Update(uuid.Must(uuid.Parse(id)), &collectionPlantRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (this *CollectionPlantHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}
	this.l.Print("Delete collection plant with the id ", id)
	headers := r.Header
	_, ok := headers["Username"]
	if !ok {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	username := r.Header["Username"][0] //todo ovo zastiti da ne puca index out of range

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	err := this.ICollectionPlantService.Delete(uuid.Must(uuid.Parse(id)), username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
