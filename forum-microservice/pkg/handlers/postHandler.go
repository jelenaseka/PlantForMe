package handlers

import (
	"encoding/json"
	"fmt"
	"forum-microservice/pkg/dto"
	"forum-microservice/pkg/service"
	"forum-microservice/pkg/utils"
	"forum-microservice/pkg/utils/error_utils"
	"log"
	"net/http"
	"strconv"

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

	orderBy := r.URL.Query().Get("orderBy")
	page := r.URL.Query().Get("page")
	category := r.URL.Query().Get("category")
	fmt.Println("category: ", category)

	var posts []dto.PostResponse
	var postsWithComments []dto.PostCountCommentsResponse
	var err error_utils.MessageErr

	// TODO check page error
	if pageNum, errconv := strconv.Atoi(page); errconv == nil {
		postsWithComments, err = this.IPostService.GetAllPageable(pageNum, category)
		if err != nil {
			http.Error(w, err.Message(), err.Status())
			return
		} else {
			json.NewEncoder(w).Encode(postsWithComments)
			return
		}
	} else if orderBy == "createdAt" {
		posts, err = this.IPostService.GetAllOrderByCreatedAt()
	} else {
		posts, err = this.IPostService.GetAll()
	}

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

func (this *PostHandler) GetAllCountComments(w http.ResponseWriter, r *http.Request) {
	posts, err := this.IPostService.GetAllCountComments()

	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(posts)
}

func (this *PostHandler) GetPostsCount(w http.ResponseWriter, r *http.Request) {

	category := r.URL.Query().Get("category")
	this.l.Println("category is: ", category)

	count, err := this.IPostService.GetPostsCount(category)

	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(count)
}
