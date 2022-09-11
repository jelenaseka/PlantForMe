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
	taskRepository := repository.NewTaskRepository()

	// SERVICES

	collectionService := service.NewCollectionService(collectionRepository)
	collectionPlantService := service.NewCollectionPlantService(collectionPlantRepository, collectionRepository)
	taskService := service.NewTaskService(taskRepository)

	// HANDLERS

	collectionHandler := handlers.NewCollectionHandler(l, collectionService)
	collectionPlantHandler := handlers.NewCollectionPlantHandler(l, collectionPlantService)
	taskHandler := handlers.NewTaskHandler(l, taskService)

	// GET

	getCollectionsR := r.Methods(http.MethodGet).Subrouter()
	getCollectionsR.HandleFunc("/api/collections", collectionHandler.GetAll)
	getCollectionsR.HandleFunc("/api/collections/mine", collectionHandler.GetAllByUsername)
	getCollectionsR.HandleFunc("/api/collections/{id}", collectionHandler.GetOne)

	getCollectionPlantsR := r.Methods(http.MethodGet).Subrouter()
	getCollectionPlantsR.HandleFunc("/api/collectionplants/collection/{id}", collectionPlantHandler.GetAllByCollectionId)
	getCollectionPlantsR.HandleFunc("/api/collectionplants/{id}", collectionPlantHandler.GetOne)
	getCollectionPlantsR.HandleFunc("/api/collectionplants/referents", collectionPlantHandler.GetReferentPlantsIdByUsername)

	getTasksR := r.Methods(http.MethodGet).Subrouter()
	getTasksR.HandleFunc("/api/tasks/collectionplant/{id}", taskHandler.GetAllByCollectionPlantId)

	// POST

	postCollectionsR := r.Methods(http.MethodPost).Subrouter()
	postCollectionsR.Use(collectionHandler.MiddlewareCollectionValidation)
	postCollectionsR.HandleFunc("/api/collections", collectionHandler.Create)

	postCollectionPlantsR := r.Methods(http.MethodPost).Subrouter()
	postCollectionPlantsR.Use(collectionPlantHandler.MiddlewareCollectionPlantValidation)
	postCollectionPlantsR.HandleFunc("/api/collectionplants", collectionPlantHandler.Create)

	postTasksR := r.Methods(http.MethodPost).Subrouter()
	postTasksR.Use(taskHandler.MiddlewareTaskValidation)
	postTasksR.HandleFunc("/api/tasks", taskHandler.Create)

	// PUT

	putCollectionsR := r.Methods(http.MethodPut).Subrouter()
	putCollectionsR.Use(collectionHandler.MiddlewareCollectionUpdateValidation)
	putCollectionsR.HandleFunc("/api/collections/{id}", collectionHandler.Update)

	putCollectionPlantsR := r.Methods(http.MethodPut).Subrouter()
	putCollectionPlantsR.Use(collectionPlantHandler.MiddlewareCollectionPlantUpdateValidation)
	putCollectionPlantsR.HandleFunc("/api/collectionplants/{id}", collectionPlantHandler.Update)

	putTasksR := r.Methods(http.MethodPut).Subrouter()
	putTasksR.HandleFunc("/api/tasks/{id}/done", taskHandler.SetTaskToDone)

	// DELETE

	deleteCollectionsR := r.Methods(http.MethodDelete).Subrouter()
	deleteCollectionsR.HandleFunc("/api/collections/{id}", collectionHandler.Delete)

	deleteCollectionPlantsR := r.Methods(http.MethodDelete).Subrouter()
	deleteCollectionPlantsR.HandleFunc("/api/collectionplants/{id}", collectionPlantHandler.Delete)

	deleteTasksR := r.Methods(http.MethodDelete).Subrouter()
	deleteTasksR.HandleFunc("/api/tasks/{id}", taskHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
