package main

import (
	"fmt"
	"log"
	"net/http"
	"recommendation-microservice/pkg/config"
	"recommendation-microservice/pkg/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	fmt.Print("jhghj")
	//dobavi trenutnog korisnika, msm to ces svakako dobiti kad prodje auth
	//dobavi njegove biljke tako sto zoves plantcare-ms
	//posalji te biljke plant-ms
	configuration, _ := config.LoadConfig("../../")
	l := log.Default()
	l.Println("Port is\t\t", configuration.ServerAddress)
	r := mux.NewRouter()

	rhandler := handlers.NewRecommendationHandler(l)

	getRecommendationR := r.Methods(http.MethodGet).Subrouter()
	getRecommendationR.HandleFunc("/api/recommendation", rhandler.GetRecommendation)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE", "PUT"},
	})
	handler := c.Handler(r)

	http.ListenAndServe(configuration.ServerAddress, handler)
}
