package main

import (
	"fmt"
	"log"
	"net/http"

	"plant-microservice/pkg/config"
	"plant-microservice/pkg/data"
	"plant-microservice/pkg/handlers"
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
	db := config.GetDB()
	db.AutoMigrate(&data.Plant{})
	db.AutoMigrate(&data.Category{})
	db.AutoMigrate(&data.BloomingMonth{})

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

	http.ListenAndServe(configuration.ServerAddress, r)

}
