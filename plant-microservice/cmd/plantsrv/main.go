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
)

func main() {
	configuration, err := config.LoadConfig("../../")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}
	fmt.Println("Reading variables using the model..")
	fmt.Println("Database is\t", configuration.DBName)
	fmt.Println("Port is\t\t", configuration.ServerAddress)
	fmt.Println("DSN\t", configuration.DSN)

	config.Connect(configuration.DSN)
	// db := config.GetDB()

	// db.AutoMigrate(&data.Plant{})
	// db.AutoMigrate(&data.Category{})
	// db.AutoMigrate(&data.BloomingMonth{})

	// config.InitDatabase(db)

	r := mux.NewRouter()
	l := log.Default()

	// REPOSITORIES

	plantRepository := repository.NewPlantRepository()
	bloomingMonthRepository := repository.NewBloomingMonthRepository()
	categoryRepository := repository.NewCategoryRepository()

	// SERVICES

	categoryService := service.NewCategoryService(categoryRepository)
	bloomingMonthService := service.NewBloomingMonthService(bloomingMonthRepository)
	plantService := service.NewPlantService(plantRepository, categoryService, bloomingMonthService)

	// HANDLERS

	plantHandler := handlers.NewPlantHandler(l, plantService)
	categoryHandler := handlers.NewCategoryHandler(l, categoryService)

	// GET
	getPlantsR := r.Methods(http.MethodGet).Subrouter()
	getPlantsR.HandleFunc("/api/plants", plantHandler.GetAll)
	getPlantsR.HandleFunc("/api/plants/{id}", plantHandler.GetOne)

	getCategoriesR := r.Methods(http.MethodGet).Subrouter()
	getCategoriesR.HandleFunc("/api/categories", categoryHandler.GetAll)
	getCategoriesR.HandleFunc("/api/categories/{id}", categoryHandler.GetOne)

	// POST
	postPlantR := r.Methods(http.MethodPost).Subrouter()
	postPlantR.Use(plantHandler.MiddlewarePlantValidation)
	postPlantR.HandleFunc("/api/plants", plantHandler.Create)

	postCategoryR := r.Methods(http.MethodPost).Subrouter()
	postCategoryR.Use(categoryHandler.MiddlewareCategoryValidation)
	postCategoryR.HandleFunc("/api/categories", categoryHandler.Create)

	// PUT

	putPlantR := r.Methods(http.MethodPut).Subrouter()
	putPlantR.Use(plantHandler.MiddlewarePlantValidation)
	putPlantR.HandleFunc("/api/plants/{id}", plantHandler.Update)

	putCategoryR := r.Methods(http.MethodPut).Subrouter()
	putCategoryR.Use(categoryHandler.MiddlewareCategoryValidation)
	putCategoryR.HandleFunc("/api/categories/{id}", categoryHandler.Update)

	// DELETE

	deletePlantR := r.Methods(http.MethodDelete).Subrouter()
	deletePlantR.HandleFunc("/api/plants/{id}", plantHandler.Delete)

	deleteCategoryR := r.Methods(http.MethodDelete).Subrouter()
	deleteCategoryR.HandleFunc("/api/categories/{id}", categoryHandler.Delete)

	http.ListenAndServe(configuration.ServerAddress, r)

}
