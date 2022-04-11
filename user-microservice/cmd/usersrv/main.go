package main

import (
	"fmt"
	"log"
	"net/http"
	"user-microservise/pkg/auth"
	"user-microservise/pkg/config"
	"user-microservise/pkg/handlers"
	"user-microservise/pkg/repository"
	"user-microservise/pkg/services"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
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

	r := mux.NewRouter()
	l := log.Default()

	userRepository := repository.NewUserRepository()
	userService := services.NewUserService(userRepository)
	userHandler := handlers.NewUserHandler(l, userService)

	authService := auth.NewAuthService(userRepository)
	authHandler := auth.NewAuthHandler(l, authService)

	// GET

	getUsersR := r.Methods(http.MethodGet).Subrouter()
	getUsersR.HandleFunc("/api/users", userHandler.GetAll)
	getUsersR.HandleFunc("/api/users/{id}", userHandler.GetOne)

	// POST

	postUserR := r.Methods(http.MethodPost).Subrouter()
	// postUserR.Use(userHandler.MiddlewareUserAuth)
	postUserR.Use(userHandler.MiddlewareUserValidation)
	postUserR.HandleFunc("/api/users", userHandler.Create)

	postAuthR := r.Methods(http.MethodPost).Subrouter()
	postAuthR.Use(authHandler.MiddlewareUserCredentialsValidation)
	postAuthR.HandleFunc("/api/auth/login", authHandler.Login)

	getAuthR := r.Methods(http.MethodGet).Subrouter()
	getAuthR.Use(authHandler.MiddlewareAuthentication)
	getAuthR.HandleFunc("/api/auth/me", authHandler.Me)

	// PUT

	putUserR := r.Methods(http.MethodPut).Subrouter()
	putUserR.Use(userHandler.MiddlewareUserValidation)
	putUserR.HandleFunc("/api/users/{id}", userHandler.Update)

	// DELETE

	deleteUserR := r.Methods(http.MethodDelete).Subrouter()
	deleteUserR.HandleFunc("/api/users/{id}", userHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
