package main

import (
	"api-gateway/pkg/config"
	"api-gateway/pkg/handlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	configuration, _ := config.LoadConfig("../../")
	fmt.Println("Port is\t\t", configuration.ServerAddress)

	r := mux.NewRouter()
	r.Use(handlers.MiddlewareAuthorization)
	l := log.Default()

	userHandler := handlers.NewUserHandler(l)

	// USER-MICROSERVICE

	getUsersR := r.Methods(http.MethodGet).Subrouter()
	getUsersR.HandleFunc("/api/users", userHandler.GetAll)
	getUsersR.HandleFunc("/api/users/{id}", userHandler.GetOne)
	// getUsersR.Use(auth.MiddlewareAuthorization(e))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
		AllowedHeaders:   []string{"*"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
