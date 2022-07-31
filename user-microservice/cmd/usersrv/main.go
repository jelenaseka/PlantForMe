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

	"github.com/casbin/casbin/v2"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	configuration, _ := config.LoadConfig("../../")
	fmt.Println("Port is\t\t", configuration.ServerAddress)

	auth.JwtKey = []byte(configuration.JWTSecretKey)

	config.Connect(configuration.DSN)

	e, _ := casbin.NewEnforcer("../../auth_model.conf", "../../policy.csv")

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

	getAuthGatewayR := r.Methods(http.MethodGet).Subrouter()
	getAuthGatewayR.HandleFunc("/api/auth/authorized", authHandler.IsAuthorized)
	getAuthGatewayR.Use(auth.MiddlewareAuthentication)
	getAuthGatewayR.Use(auth.MiddlewareAuthorizationFromAPIGateway(e))

	getAuthR := r.Methods(http.MethodGet).Subrouter()
	getAuthR.HandleFunc("/api/auth/me", authHandler.Me)

	// POST

	postUserR := r.Methods(http.MethodPost).Subrouter()
	postUserR.Use(userHandler.MiddlewareUserValidation)
	postUserR.HandleFunc("/api/users", userHandler.Create)

	postAuthR := r.Methods(http.MethodPost).Subrouter()
	postAuthR.Use(authHandler.MiddlewareUserCredentialsValidation)
	postAuthR.HandleFunc("/api/auth/login", authHandler.Login)

	postAuthRegisterR := r.Methods(http.MethodPost).Subrouter()
	postAuthRegisterR.HandleFunc("/api/auth/register", authHandler.Registration)
	postAuthRegisterR.Use(authHandler.MiddlewareRegisterUserValidation)

	// PUT

	putUserR := r.Methods(http.MethodPut).Subrouter()
	putUserR.Use(userHandler.MiddlewareUserValidation)
	putUserR.HandleFunc("/api/users/{id}", userHandler.Update)

	// PUT AUTH

	putAuthR := r.Methods(http.MethodPut).Subrouter()
	putAuthR.HandleFunc("/api/auth/username", authHandler.ChangeUsername)
	putAuthR.HandleFunc("/api/auth/password", authHandler.ChangePassword)

	// DELETE

	deleteUserR := r.Methods(http.MethodDelete).Subrouter()
	deleteUserR.HandleFunc("/api/users/{id}", userHandler.Delete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
		AllowedHeaders:   []string{"*"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
