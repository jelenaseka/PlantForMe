package main

import (
	"fmt"
	"forum-microservice/pkg/config"
	"forum-microservice/pkg/handlers"
	"forum-microservice/pkg/repository"
	"forum-microservice/pkg/service"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	configuration, _ := config.LoadConfig("../../")
	fmt.Println("Port is\t\t", configuration.ServerAddress)

	config.Connect(configuration.DSN)

	r := mux.NewRouter()
	l := log.Default()

	postRepository := repository.NewPostRepository()
	postService := service.NewPostService(postRepository)
	postHandler := handlers.NewPostHandler(l, postService)

	commentRepository := repository.NewCommentRepository()
	commentService := service.NewCommentService(commentRepository, postService)
	commentHandler := handlers.NewCommentHandler(l, commentService)

	getPostsR := r.Methods(http.MethodGet).Subrouter()
	getPostsR.HandleFunc("/api/posts", postHandler.GetAll)
	getPostsR.HandleFunc("/api/posts/{id}", postHandler.GetOne)

	getCommentsR := r.Methods(http.MethodGet).Subrouter()
	getCommentsR.HandleFunc("/api/comments", commentHandler.GetAll)
	getCommentsR.HandleFunc("/api/comments/{id}", commentHandler.GetOne)

	postPostR := r.Methods(http.MethodPost).Subrouter()
	postPostR.Use(postHandler.MiddlewarePostValidation)
	postPostR.HandleFunc("/api/posts", postHandler.Create)

	postCommentR := r.Methods(http.MethodPost).Subrouter()
	postCommentR.Use(commentHandler.MiddlewareCommentValidation)
	postCommentR.HandleFunc("/api/comments", commentHandler.Create)

	putPostR := r.Methods(http.MethodPut).Subrouter()
	putPostR.Use(postHandler.MiddlewarePostValidation)
	putPostR.HandleFunc("/api/posts/{id}", postHandler.Update)

	putCommentR := r.Methods(http.MethodPut).Subrouter()
	putCommentR.Use(commentHandler.MiddlewareCommentValidation)
	putCommentR.HandleFunc("/api/comments/{id}", commentHandler.Update)

	deletePostR := r.Methods(http.MethodDelete).Subrouter()
	deletePostR.HandleFunc("/api/posts/{id}", postHandler.Delete)

	deleteCommentR := r.Methods(http.MethodDelete).Subrouter()
	deleteCommentR.HandleFunc("/api/comments/{id}", commentHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
		AllowedHeaders:   []string{"*"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
