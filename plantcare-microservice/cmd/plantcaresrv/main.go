package main

import (
	"log"
	"net/http"

	// "user-microservise/pkg/auth"
	"plantcare-microservice/pkg/config"
	"plantcare-microservice/pkg/handlers"
	"plantcare-microservice/pkg/repository"
	"plantcare-microservice/pkg/service"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	configuration, _ := config.LoadConfig("../../")
	l := log.Default()
	l.Println("Port is\t\t", configuration.ServerAddress)
	config.Connect(configuration.DSN)
	r := mux.NewRouter()

	// REPOSITORIES

	collectionRepository := repository.NewCollectionRepository()
	collectionPlantRepository := repository.NewCollectionPlantRepository()

	// SERVICES

	collectionService := service.NewCollectionService(collectionRepository)
	collectionPlantService := service.NewCollectionPlantService(collectionPlantRepository, collectionRepository)

	// HANDLERS

	collectionHandler := handlers.NewCollectionHandler(l, collectionService)
	collectionPlantHandler := handlers.NewCollectionPlantHandler(l, collectionPlantService)

	// GET

	getCollectionsR := r.Methods(http.MethodGet).Subrouter()
	getCollectionsR.HandleFunc("/api/collections", collectionHandler.GetAll)
	getCollectionsR.HandleFunc("/api/collections/mine", collectionHandler.GetAllByUsername)
	getCollectionsR.HandleFunc("/api/collections/{id}", collectionHandler.GetOne)

	getCollectionPlantsR := r.Methods(http.MethodGet).Subrouter()
	getCollectionPlantsR.HandleFunc("/api/collectionplants/collection/{id}", collectionPlantHandler.GetAllByCollectionId)
	getCollectionPlantsR.HandleFunc("/api/collectionplants/{id}", collectionPlantHandler.GetOne)

	// POST

	postCollectionsR := r.Methods(http.MethodPost).Subrouter()
	postCollectionsR.Use(collectionHandler.MiddlewareCollectionValidation)
	postCollectionsR.HandleFunc("/api/collections", collectionHandler.Create)

	postCollectionPlantsR := r.Methods(http.MethodPost).Subrouter()
	postCollectionPlantsR.Use(collectionPlantHandler.MiddlewareCollectionPlantValidation)
	postCollectionPlantsR.HandleFunc("/api/collectionplants", collectionPlantHandler.Create)

	// PUT

	putCollectionsR := r.Methods(http.MethodPut).Subrouter()
	putCollectionsR.Use(collectionHandler.MiddlewareCollectionUpdateValidation)
	putCollectionsR.HandleFunc("/api/collections/{id}", collectionHandler.Update)

	putCollectionPlantsR := r.Methods(http.MethodPut).Subrouter()
	putCollectionPlantsR.Use(collectionPlantHandler.MiddlewareCollectionPlantUpdateValidation)
	putCollectionPlantsR.HandleFunc("/api/collectionplants/{id}", collectionPlantHandler.Update)

	// DELETE

	deleteCollectionsR := r.Methods(http.MethodDelete).Subrouter()
	deleteCollectionsR.HandleFunc("/api/collections/{id}", collectionHandler.Delete)

	deleteCollectionPlantsR := r.Methods(http.MethodDelete).Subrouter()
	deleteCollectionPlantsR.HandleFunc("/api/collectionplants/{id}", collectionPlantHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
