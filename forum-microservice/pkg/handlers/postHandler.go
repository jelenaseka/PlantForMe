package handlers

import (
	"encoding/json"
	"forum-microservice/pkg/dto"
	"forum-microservice/pkg/service"
	"forum-microservice/pkg/utils"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type PostHandler struct {
	l            *log.Logger
	IPostService service.PostServiceInterface
}

func NewPostHandler(l *log.Logger, s service.PostServiceInterface) *PostHandler {
	return &PostHandler{l, s}
}

func (this *PostHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all posts")

	w.Header().Add("Content-Type", "application/json")

	posts, err := this.IPostService.GetAll()
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(posts)
}

func (this *PostHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Println("Get post with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	postResponse, err := this.IPostService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(postResponse)
}

func (this *PostHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create post")

	postRequest := r.Context().Value(ContextPostKey{}).(dto.PostRequest)

	id, err := this.IPostService.Create(&postRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *PostHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Update post with the id ", id)

	postRequest := r.Context().Value(ContextPostKey{}).(dto.PostRequest)

	err := this.IPostService.Update(&postRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (this *PostHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Delete post with the id ", id)

	err := this.IPostService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
