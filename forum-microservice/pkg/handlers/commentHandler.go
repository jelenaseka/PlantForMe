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

type CommentHandler struct {
	l               *log.Logger
	ICommentService service.CommentServiceInterface
}

func NewCommentHandler(l *log.Logger, s service.CommentServiceInterface) *CommentHandler {
	return &CommentHandler{l, s}
}

func (this *CommentHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all comments")

	w.Header().Add("Content-Type", "application/json")

	comments, err := this.ICommentService.GetAll()
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}

	json.NewEncoder(w).Encode(comments)
}

func (this *CommentHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Println("Get comment with the id ", id)

	w.Header().Add("Content-Type", "application/json")

	commentResponse, err := this.ICommentService.GetOneById(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	json.NewEncoder(w).Encode(commentResponse)
}

func (this *CommentHandler) Create(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Create comment")

	commentRequest := r.Context().Value(ContextCommentKey{}).(dto.CommentRequest)

	id, err := this.ICommentService.Create(&commentRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *CommentHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Update comment with the id ", id)

	commentRequest := r.Context().Value(ContextCommentKey{}).(dto.CommentRequest)

	err := this.ICommentService.Update(&commentRequest, uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}

func (this *CommentHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if !utils.IsValidUUID(id) {
		http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
		return
	}

	this.l.Print("Delete comment with the id ", id)

	err := this.ICommentService.Delete(uuid.Must(uuid.Parse(id)))
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
