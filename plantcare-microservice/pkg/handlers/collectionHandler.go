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

type CollectionHandler struct {
	l                  *log.Logger
	ICollectionService service.CollectionServiceInterface
}

func NewCollectionHandler(l *log.Logger, s service.CollectionServiceInterface) *CollectionHandler {
	return &CollectionHandler{l, s}
}

func (this *CollectionHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all collections")

	collections, err := this.ICollectionService.GetAll()
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(collections)
}

func (this *CollectionHandler) GetAllByUsername(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all collections")

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

	collections, err := this.ICollectionService.GetAllByUsername(username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(collections)
}

func (this *CollectionHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Println("Get collection with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	collectionResponse, err := this.ICollectionService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(collectionResponse)
}

func (this *CollectionHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create collection")

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

	collectionRequest := r.Context().Value(ContextCollectionKey{}).(dto.CollectionRequest)

	id, err := this.ICollectionService.Create(&collectionRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *CollectionHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Update collection with the id ", id)

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

	collectionRequest := r.Context().Value(ContextCollectionUpdateKey{}).(dto.CollectionUpdateRequest)

	err := this.ICollectionService.Update(uuid.Must(uuid.Parse(id)), &collectionRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (this *CollectionHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	//TODO napravi proveru u middleware a ovde samo uzmi bez provere
	this.l.Print("Delete collection with the id ", id)
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

	err := this.ICollectionService.Delete(uuid.Must(uuid.Parse(id)), username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
