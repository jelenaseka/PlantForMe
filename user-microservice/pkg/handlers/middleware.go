package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"user-microservise/pkg/dto"
)

type ContextUserKey struct{}

func (u *UserHandler) MiddlewareUserValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.RequestURI)

		var userRequest dto.UserRequest
		err := json.NewDecoder(r.Body).Decode(&userRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = userRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextUserKey{}, userRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
