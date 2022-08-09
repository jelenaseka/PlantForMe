package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"plantcare-microservice/pkg/dto"
)

type ContextCollectionKey struct{}
type ContextCollectionUpdateKey struct{}

type ContextCollectionPlantKey struct{}
type ContextCollectionPlantUpdateKey struct{}

type ContextTaskKey struct{}

func (handler *CollectionHandler) MiddlewareCollectionValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print(r.RequestURI)

		var collectionRequest dto.CollectionRequest
		err := json.NewDecoder(r.Body).Decode(&collectionRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = collectionRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextCollectionKey{}, collectionRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func (handler *CollectionHandler) MiddlewareCollectionUpdateValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print(r.RequestURI)

		var collectionRequest dto.CollectionUpdateRequest
		err := json.NewDecoder(r.Body).Decode(&collectionRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = collectionRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextCollectionUpdateKey{}, collectionRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

// collection plant

func (handler *CollectionPlantHandler) MiddlewareCollectionPlantValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print(r.RequestURI)

		var collectionPlantRequest dto.CollectionPlantRequest
		err := json.NewDecoder(r.Body).Decode(&collectionPlantRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = collectionPlantRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextCollectionPlantKey{}, collectionPlantRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func (handler *CollectionPlantHandler) MiddlewareCollectionPlantUpdateValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print(r.RequestURI)

		var collectionPlantRequest dto.CollectionPlantUpdateRequest
		err := json.NewDecoder(r.Body).Decode(&collectionPlantRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = collectionPlantRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextCollectionPlantUpdateKey{}, collectionPlantRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

// task

func (handler *TaskHandler) MiddlewareTaskValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print(r.RequestURI)

		var taskRequest dto.TaskRequest
		err := json.NewDecoder(r.Body).Decode(&taskRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = taskRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextTaskKey{}, taskRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
