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
}

func NewCategoryHandler(l *log.Logger, s service.CategoryServiceInterface) *CategoryHandler {
	return &CategoryHandler{l, s}
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

	categoryRequest := r.Context().Value(ContextCategoryKey{}).(dto.CategoryRequest)

	id, err := this.ICategoryService.Create(&categoryRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

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

	this.l.Print("Update category with the id ", id)

	categoryRequest := r.Context().Value(ContextCategoryKey{}).(dto.CategoryRequest)

	err := this.ICategoryService.Update(&categoryRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (this *CategoryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Delete category with the id ", id)

	err := this.ICategoryService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
