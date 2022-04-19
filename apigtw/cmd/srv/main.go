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

	deleteUserR := r.Methods(http.MethodDelete).Subrouter()
	deleteUserR.HandleFunc("/api/users/{id}", handlers.Delete(configuration.UserAddress))

	// PLANT-MICROSERVICE

	getPlantsR := r.Methods(http.MethodGet).Subrouter()
	getPlantsR.HandleFunc("/api/plants", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/plants/{id}", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/categories", handlers.Get(configuration.PlantAddress))
	getPlantsR.HandleFunc("/api/categories/{id}", handlers.Get(configuration.PlantAddress))

	postPlantR := r.Methods(http.MethodPost).Subrouter()
	postPlantR.HandleFunc("/api/plants", handlers.Post(configuration.PlantAddress))
	postPlantR.HandleFunc("/api/categories", handlers.Post(configuration.PlantAddress))

	putPlantR := r.Methods(http.MethodPut).Subrouter()
	putPlantR.HandleFunc("/api/plants/{id}", handlers.Put(configuration.PlantAddress))
	putPlantR.HandleFunc("/api/categories/{id}", handlers.Put(configuration.PlantAddress))

	deletePlantR := r.Methods(http.MethodDelete).Subrouter()
	deletePlantR.HandleFunc("/api/plants/{id}", handlers.Delete(configuration.PlantAddress))
	deletePlantR.HandleFunc("/api/categories/{id}", handlers.Delete(configuration.PlantAddress))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{configuration.FrontendAddress},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
		AllowedHeaders:   []string{"*"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
