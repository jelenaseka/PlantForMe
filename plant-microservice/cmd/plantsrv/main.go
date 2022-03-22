package main

import (
	"log"
	"net/http"

	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/handlers"
	"plant-microservice/pkg/service"

	"github.com/gorilla/mux"
)

func init() {
	config.Connect()
	db := config.GetDB()
	db.AutoMigrate(&data.Plant{})
	db.AutoMigrate(&data.Category{})
	db.AutoMigrate(&data.BloomingMonth{})

}

func main() {
	r := mux.NewRouter()
	l := log.Default()
	plantService := service.NewPlantService()
	plantHandler := handlers.NewPlantHandler(l, plantService)
	getR := r.Methods(http.MethodGet).Subrouter()
	getR.HandleFunc("/api/plants", plantHandler.GetAll)
	getR.HandleFunc("/api/plants/{id}", plantHandler.GetOne)
	postR := r.Methods(http.MethodPost).Subrouter()
	postR.HandleFunc("/api/plants", plantHandler.Create)
	putR := r.Methods(http.MethodPut).Subrouter()
	putR.HandleFunc("/api/plants/{id}", plantHandler.Update)
	deleteR := r.Methods(http.MethodDelete).Subrouter()
	deleteR.HandleFunc("/api/plants/{id}", plantHandler.Delete)

	http.ListenAndServe(":8085", r)

}
