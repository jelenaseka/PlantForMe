package handlers

import (
	"log"
	"net/http"
	"plant-microservice/pkg/service"
)

type Plant struct {
	l            *log.Logger
	PlantService *service.PlantService
}

func NewPlantHandler(l *log.Logger, s *service.PlantService) *Plant {
	return &Plant{l, s}
}

func (plant *Plant) GetAll(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Get all plants")
}

func (plant *Plant) GetOne(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Get one plant")
}

func (plant *Plant) Create(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Create plant")
}

func (plant *Plant) Update(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Update plant")
}

func (plant *Plant) Delete(w http.ResponseWriter, r *http.Request) {
	plant.l.Print("Delete plant")
}
