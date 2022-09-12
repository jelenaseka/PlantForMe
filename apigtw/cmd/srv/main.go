package main

import (
	"api-gateway/pkg/config"
	"api-gateway/pkg/handlers"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	configuration, _ := config.LoadConfig("../../")
	fmt.Println("Port is\t\t", configuration.ServerAddress)

	r := mux.NewRouter()
	r.Use(handlers.MiddlewareAuthorization)

	// USER-MICROSERVICE

	getUsersR := r.Methods(http.MethodGet).Subrouter()
	getUsersR.HandleFunc("/api/users", handlers.Get(configuration.UserAddress))
	getUsersR.HandleFunc("/api/users/{id}", handlers.Get(configuration.UserAddress))
	getUsersR.HandleFunc("/api/auth/me", handlers.Me(configuration.UserAddress))

	postUserR := r.Methods(http.MethodPost).Subrouter()
	postUserR.HandleFunc("/api/users", handlers.Post(configuration.UserAddress))
	postUserR.HandleFunc("/api/auth/login", handlers.Post(configuration.UserAddress))
	postUserR.HandleFunc("/api/auth/register", handlers.Post(configuration.UserAddress))

	putUserR := r.Methods(http.MethodPut).Subrouter()
	putUserR.HandleFunc("/api/users/{id}", handlers.Put(configuration.UserAddress))
	putUserR.HandleFunc("/api/auth/username", handlers.Put(configuration.UserAddress))
	putUserR.HandleFunc("/api/auth/password", handlers.Put(configuration.UserAddress))

	deleteUserR := r.Methods(http.MethodDelete).Subrouter()
	deleteUserR.HandleFunc("/api/users/{id}", handlers.Delete(configuration.UserAddress))

	// PLANT-MICROSERVICE

	postLogsR := r.Methods(http.MethodPost).Subrouter()
	postLogsR.HandleFunc("/api/logs", handlers.Post(configuration.PlantAddress))

	getPlantsR := r.Methods(http.MethodGet).Subrouter()
	getPlantsR.HandleFunc("/api/plants", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plants/references", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plants/{id}", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plants/{id}/cat", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/categories", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/categories/{id}", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plantreviews/plant/{id}", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plantreviews/plant/{id}/rating", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plantreviews/plant/{id}/mine", handlers.Get(configuration.PlantAddress))

	postPlantR := r.Methods(http.MethodPost).Subrouter()
	postPlantR.HandleFunc("/api/plants", handlers.Post(configuration.PlantAddress))
	postPlantR.HandleFunc("/api/categories", handlers.Post(configuration.PlantAddress))
	postPlantR.HandleFunc("/api/plantreviews", handlers.Post(configuration.PlantAddress))

	putPlantR := r.Methods(http.MethodPut).Subrouter()
	putPlantR.HandleFunc("/api/plants/{id}", handlers.Put(configuration.PlantAddress))
	putPlantR.HandleFunc("/api/categories/{id}", handlers.Put(configuration.PlantAddress))
	putPlantR.HandleFunc("/api/plantreviews/{id}", handlers.Put(configuration.PlantAddress))

	deletePlantR := r.Methods(http.MethodDelete).Subrouter()
	deletePlantR.HandleFunc("/api/plants/{id}", handlers.Delete(configuration.PlantAddress))
	deletePlantR.HandleFunc("/api/categories/{id}", handlers.Delete(configuration.PlantAddress))
	deletePlantR.HandleFunc("/api/plantreviews/{id}", handlers.Delete(configuration.PlantAddress))

	// FORUM-MICROSERVICE

	getForumR := r.Methods(http.MethodGet).Subrouter()
	getForumR.HandleFunc("/api/posts", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/posts/{id}", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/comments", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/comments/{id}", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/comments/{id}/count", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/comments/post/{id}", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/forum/categories", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/forum/categories/{id}", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/forum/categories/count/posts", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/posts/count/comments", handlers.Get(configuration.ForumAddress))
	getForumR.HandleFunc("/api/posts/all/count", handlers.Get(configuration.ForumAddress))

	postForumR := r.Methods(http.MethodPost).Subrouter()
	postForumR.HandleFunc("/api/posts", handlers.Post(configuration.ForumAddress))
	postForumR.HandleFunc("/api/comments", handlers.Post(configuration.ForumAddress))
	postForumR.HandleFunc("/api/forum/categories", handlers.Post(configuration.ForumAddress))

	putForumR := r.Methods(http.MethodPut).Subrouter()
	putForumR.HandleFunc("/api/posts/{id}", handlers.Put(configuration.ForumAddress))
	putForumR.HandleFunc("/api/comments/{id}", handlers.Put(configuration.ForumAddress))
	putForumR.HandleFunc("/api/forum/categories/{id}", handlers.Put(configuration.ForumAddress))

	deleteForumR := r.Methods(http.MethodDelete).Subrouter()
	deleteForumR.HandleFunc("/api/posts/{id}", handlers.Delete(configuration.ForumAddress))
	deleteForumR.HandleFunc("/api/comments/{id}", handlers.Delete(configuration.ForumAddress))
	deleteForumR.HandleFunc("/api/forum/categories/{id}", handlers.Delete(configuration.ForumAddress))

	// PLANT-CARE MICROSERVICE

	getPlantCareR := r.Methods(http.MethodGet).Subrouter()
	getPlantCareR.HandleFunc("/api/collections", handlers.Get(configuration.PlantCareAddress))
	getPlantCareR.HandleFunc("/api/collections/{id}", handlers.Get(configuration.PlantCareAddress))
	getPlantCareR.HandleFunc("/api/collections/mine", handlers.Get(configuration.PlantCareAddress))
	getPlantCareR.HandleFunc("/api/collectionplants/collection/{id}", handlers.Get(configuration.PlantCareAddress))
	getPlantCareR.HandleFunc("/api/collectionplants/{id}", handlers.Get(configuration.PlantCareAddress))

	postPlantCareR := r.Methods(http.MethodPost).Subrouter()
	postPlantCareR.HandleFunc("/api/collections", handlers.Post(configuration.PlantCareAddress))
	postPlantCareR.HandleFunc("/api/collectionplants", handlers.Post(configuration.PlantCareAddress))
	postPlantCareR.HandleFunc("/api/tasks", handlers.Post(configuration.PlantCareAddress))

	putPlantCareR := r.Methods(http.MethodPut).Subrouter()
	putPlantCareR.HandleFunc("/api/collections/{id}", handlers.Put(configuration.PlantCareAddress))
	putPlantCareR.HandleFunc("/api/collectionplants/{id}", handlers.Put(configuration.PlantCareAddress))
	putPlantCareR.HandleFunc("/api/tasks/{id}/done", handlers.Put(configuration.PlantCareAddress))

	deletePlantCareR := r.Methods(http.MethodDelete).Subrouter()
	deletePlantCareR.HandleFunc("/api/collections/{id}", handlers.Delete(configuration.PlantCareAddress))
	deletePlantCareR.HandleFunc("/api/collectionplants/{id}", handlers.Delete(configuration.PlantCareAddress))
	deletePlantCareR.HandleFunc("/api/tasks/{id}", handlers.Delete(configuration.PlantCareAddress))

	// RECOMMENDATION MICROSERVICE

	getRecommendationR := r.Methods(http.MethodGet).Subrouter()
	getRecommendationR.HandleFunc("/api/recommendation", handlers.Get(configuration.RecommendationAddress))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{configuration.FrontendAddress, "http://localhost:8089"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
		AllowedHeaders:   []string{"*"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
