package main

import (
	"fmt"
	"log"
	"net/http"

	"plant-microservice/pkg/config"
	"plant-microservice/pkg/handlers"
	"plant-microservice/pkg/repository"
	"plant-microservice/pkg/service"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	configuration, _ := config.LoadConfig("../../")
	fmt.Println("Port is\t\t", configuration.ServerAddress)

	config.Connect(configuration.DSN)

	r := mux.NewRouter()
	l := log.Default()

	// REPOSITORIES

	plantRepository := repository.NewPlantRepository()
	bloomingMonthRepository := repository.NewBloomingMonthRepository()
	categoryRepository := repository.NewCategoryRepository()
	plantReviewRepository := repository.NewPlantReviewRepository()

	// SERVICES

	categoryService := service.NewCategoryService(categoryRepository)
	bloomingMonthService := service.NewBloomingMonthService(bloomingMonthRepository)
	plantService := service.NewPlantService(plantRepository, categoryService, bloomingMonthService)
	plantReviewService := service.NewPlantReviewService(plantReviewRepository, plantService)
	logsService := service.NewLogsService()

	// HANDLERS

	plantHandler := handlers.NewPlantHandler(l, plantService, logsService)
	categoryHandler := handlers.NewCategoryHandler(l, categoryService, logsService)
	plantReviewHandler := handlers.NewPlantReviewHandler(l, plantReviewService)
	logsHandler := handlers.NewLogsHandler(logsService)

	// GET
	getPlantsR := r.Methods(http.MethodGet).Subrouter()
	getPlantsR.HandleFunc("/api/plants", plantHandler.GetAll)
	getPlantsR.HandleFunc("/api/plants/{id}", plantHandler.GetOne)
	getPlantsR.HandleFunc("/api/plants/{id}/cat", plantHandler.GetOneWithCategory)

	getCategoriesR := r.Methods(http.MethodGet).Subrouter()
	getCategoriesR.HandleFunc("/api/categories", categoryHandler.GetAll)
	getCategoriesR.HandleFunc("/api/categories/{id}", categoryHandler.GetOne)

	getPlantReviewsR := r.Methods(http.MethodGet).Subrouter()
	getPlantReviewsR.HandleFunc("/api/plantreviews/plant/{id}", plantReviewHandler.GetAllByPlant)
	getPlantReviewsR.HandleFunc("/api/plantreviews/plant/{id}/rating", plantReviewHandler.GetAverageRatingByPlant)
	getPlantReviewsR.HandleFunc("/api/plantreviews/plant/{id}/mine", plantReviewHandler.GetUserReviewByPlant)

	// POST
	postPlantR := r.Methods(http.MethodPost).Subrouter()
	postPlantR.Use(plantHandler.MiddlewarePlantValidation)
	postPlantR.HandleFunc("/api/plants", plantHandler.Create)

	postCategoryR := r.Methods(http.MethodPost).Subrouter()
	postCategoryR.Use(categoryHandler.MiddlewareCategoryValidation)
	postCategoryR.HandleFunc("/api/categories", categoryHandler.Create)

	postPlantReviewR := r.Methods(http.MethodPost).Subrouter()
	postPlantReviewR.Use(plantReviewHandler.MiddlewarePlantReviewValidation)
	postPlantReviewR.HandleFunc("/api/plantreviews", plantReviewHandler.Create)

	postLogsR := r.Methods(http.MethodPost).Subrouter()
	postLogsR.HandleFunc("/api/logs", logsHandler.GetLogs)

	// PUT

	putPlantR := r.Methods(http.MethodPut).Subrouter()
	putPlantR.Use(plantHandler.MiddlewarePlantValidation)
	putPlantR.HandleFunc("/api/plants/{id}", plantHandler.Update)

	putCategoryR := r.Methods(http.MethodPut).Subrouter()
	putCategoryR.Use(categoryHandler.MiddlewareCategoryValidation)
	putCategoryR.HandleFunc("/api/categories/{id}", categoryHandler.Update)

	putPlantReviewR := r.Methods(http.MethodPut).Subrouter()
	putPlantReviewR.Use(plantReviewHandler.MiddlewarePlantReviewUpdateValidation)
	putPlantReviewR.HandleFunc("/api/plantreviews/{id}", plantReviewHandler.Update)

	// DELETE

	deletePlantR := r.Methods(http.MethodDelete).Subrouter()
	deletePlantR.HandleFunc("/api/plants/{id}", plantHandler.Delete)

	deleteCategoryR := r.Methods(http.MethodDelete).Subrouter()
	deleteCategoryR.HandleFunc("/api/categories/{id}", categoryHandler.Delete)

	deletePlantReviewR := r.Methods(http.MethodDelete).Subrouter()
	deletePlantReviewR.HandleFunc("/api/plantreviews/{id}", plantReviewHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)

}
