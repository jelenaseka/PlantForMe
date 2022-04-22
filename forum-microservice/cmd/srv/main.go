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

	categoryRepository := repository.NewCategoryRepository()
	categoryService := service.NewCategoryService(categoryRepository)
	categoryHandler := handlers.NewCategoryHandler(l, categoryService)

	postRepository := repository.NewPostRepository()
	postService := service.NewPostService(postRepository, categoryService)
	postHandler := handlers.NewPostHandler(l, postService)

	commentRepository := repository.NewCommentRepository()
	commentService := service.NewCommentService(commentRepository, postService)
	commentHandler := handlers.NewCommentHandler(l, commentService)

	getPostsR := r.Methods(http.MethodGet).Subrouter()
	getPostsR.HandleFunc("/api/posts", postHandler.GetAll)
	getPostsR.HandleFunc("/api/posts/{id}", postHandler.GetOne)
	getPostsR.HandleFunc("/api/posts/count/comments", postHandler.GetAllCountComments)
	getPostsR.HandleFunc("/api/posts/all/count", postHandler.GetPostsCount)

	getCommentsR := r.Methods(http.MethodGet).Subrouter()
	getCommentsR.HandleFunc("/api/comments", commentHandler.GetAll)
	getCommentsR.HandleFunc("/api/comments/{id}", commentHandler.GetOne)

	getCategoryR := r.Methods(http.MethodGet).Subrouter()
	getCategoryR.HandleFunc("/api/forum/categories", categoryHandler.GetAll)
	getCategoryR.HandleFunc("/api/forum/categories/{id}", categoryHandler.GetOne)
	getCategoryR.HandleFunc("/api/forum/categories/count/posts", categoryHandler.GetAllCountPosts)

	postPostR := r.Methods(http.MethodPost).Subrouter()
	postPostR.Use(postHandler.MiddlewarePostValidation)
	postPostR.HandleFunc("/api/posts", postHandler.Create)

	postCommentR := r.Methods(http.MethodPost).Subrouter()
	postCommentR.Use(commentHandler.MiddlewareCommentValidation)
	postCommentR.HandleFunc("/api/comments", commentHandler.Create)

	postCategoryR := r.Methods(http.MethodPost).Subrouter()
	postCategoryR.Use(categoryHandler.MiddlewareCategoryValidation)
	postCategoryR.HandleFunc("/api/forum/categories", categoryHandler.Create)

	putPostR := r.Methods(http.MethodPut).Subrouter()
	putPostR.Use(postHandler.MiddlewarePostValidation)
	putPostR.HandleFunc("/api/posts/{id}", postHandler.Update)

	putCommentR := r.Methods(http.MethodPut).Subrouter()
	putCommentR.Use(commentHandler.MiddlewareCommentValidation)
	putCommentR.HandleFunc("/api/comments/{id}", commentHandler.Update)

	putCategoryR := r.Methods(http.MethodPut).Subrouter()
	putCategoryR.Use(categoryHandler.MiddlewareCategoryValidation)
	putCategoryR.HandleFunc("/api/forum/categories/{id}", categoryHandler.Update)

	deletePostR := r.Methods(http.MethodDelete).Subrouter()
	deletePostR.HandleFunc("/api/posts/{id}", postHandler.Delete)

	deleteCommentR := r.Methods(http.MethodDelete).Subrouter()
	deleteCommentR.HandleFunc("/api/comments/{id}", commentHandler.Delete)

	deleteCategoryR := r.Methods(http.MethodDelete).Subrouter()
	deleteCategoryR.HandleFunc("/api/forum/categories/{id}", categoryHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
		AllowedHeaders:   []string{"*"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
