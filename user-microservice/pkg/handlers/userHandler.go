package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"user-microservise/pkg/dto"
	"user-microservise/pkg/services"
	"user-microservise/pkg/utils/validation_utils"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type UserHandler struct {
	l            *log.Logger
	IUserService services.UserServiceInterface
}

func NewUserHandler(l *log.Logger, s services.UserServiceInterface) *UserHandler {
	return &UserHandler{l, s}
}

func (this *UserHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all users")
	w.Header().Add("Content-Type", "application/json")

	users, err := this.IUserService.GetAll()
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
	json.NewEncoder(w).Encode(users)
}

func (this *UserHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !validation_utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Println("Get user with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	userResponse, err := this.IUserService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(userResponse)
}

func (this *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create user")

	userRequest := r.Context().Value(ContextUserKey{}).(dto.UserRequest)

	id, err := this.IUserService.Create(&userRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !validation_utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Update user with the id ", id)

	userRequest := r.Context().Value(ContextUserKey{}).(dto.UserRequest)

	err := this.IUserService.Update(&userRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (this *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !validation_utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Delete user with the id ", id)

	err := this.IUserService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
