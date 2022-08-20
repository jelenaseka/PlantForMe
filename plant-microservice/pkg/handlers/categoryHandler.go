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

type CategoryHandler struct {
	l                *log.Logger
	ICategoryService service.CategoryServiceInterface
	ILogsService     service.LogsServiceInterface
}

func NewCategoryHandler(l *log.Logger, s service.CategoryServiceInterface, ls service.LogsServiceInterface) *CategoryHandler {
	return &CategoryHandler{l, s, ls}
}

func (this *CategoryHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all categories")

	w.Header().Add("Content-Type", "application/json")

	categories, err := this.ICategoryService.GetAll()
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(categories)
}

func (this *CategoryHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Println("Get category with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	categoryResponse, err := this.ICategoryService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(categoryResponse)
}

func (this *CategoryHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create category")

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	categoryRequest := r.Context().Value(ContextCategoryKey{}).(dto.CategoryRequest)

	id, err := this.ICategoryService.Create(&categoryRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	logLine := this.ILogsService.CreateLogLine(username, "CREATE_CATEGORY", id.UUID)
	this.ILogsService.Log(logLine)

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *CategoryHandler) Update(w http.ResponseWriter, r *http.Request) {
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

	this.l.Print("Update category with the id ", id)

	categoryRequest := r.Context().Value(ContextCategoryKey{}).(dto.CategoryRequest)

	err := this.ICategoryService.Update(&categoryRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	logLine := this.ILogsService.CreateLogLine(username, "UPDATE_CATEGORY", uuid.MustParse(id))
	this.ILogsService.Log(logLine)
}

func (this *CategoryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Delete category with the id ", id)

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	err := this.ICategoryService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	logLine := this.ILogsService.CreateLogLine(username, "DELETE_CATEGORY", uuid.MustParse(id))
	this.ILogsService.Log(logLine)
	w.WriteHeader(http.StatusNoContent)
}
