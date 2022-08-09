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

type TaskHandler struct {
	l            *log.Logger
	ITaskService service.TaskServiceInterface
}

func NewTaskHandler(l *log.Logger, s service.TaskServiceInterface) *TaskHandler {
	return &TaskHandler{l, s}
}

func (this *TaskHandler) GetAllByCollectionPlantId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}
	this.l.Print("Get all tasks by collection plant id")

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

	tasks, err := this.ITaskService.GetAllByCollectionPlantId(uuid.MustParse(id))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(tasks)
}

func (this *TaskHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create task")

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

	taskRequest := r.Context().Value(ContextTaskKey{}).(dto.TaskRequest)

	id, err := this.ITaskService.Create(&taskRequest, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *TaskHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}
	this.l.Print("Delete task with the id ", id)
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

	err := this.ITaskService.Delete(uuid.MustParse(id), username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	// w.WriteHeader(http.StatusNoContent)
}

func (this *TaskHandler) SetTaskToDone(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}
	this.l.Print("Set task to done with the id ", id)
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

	err := this.ITaskService.SetTaskToDone(uuid.MustParse(id), username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	// w.WriteHeader(http.StatusNoContent)
}
