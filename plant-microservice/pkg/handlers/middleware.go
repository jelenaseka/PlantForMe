package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"plant-microservice/pkg/dto"
)

type ContextPlantKey struct{}
type ContextCategoryKey struct{}

func (p *Plant) MiddlewarePlantValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.RequestURI)

		var plantRequest dto.PlantRequest
		err := json.NewDecoder(r.Body).Decode(&plantRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = plantRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextPlantKey{}, plantRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func (c *CategoryHandler) MiddlewareCategoryValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.RequestURI)

		var categoryRequest dto.CategoryRequest
		err := json.NewDecoder(r.Body).Decode(&categoryRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = categoryRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextCategoryKey{}, categoryRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
