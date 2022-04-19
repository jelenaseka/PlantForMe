package handlers

import (
	"context"
	"encoding/json"
	"forum-microservice/pkg/dto"
	"net/http"
)

type ContextPostKey struct{}

func (p *PostHandler) MiddlewarePostValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var postRequest dto.PostRequest
		err := json.NewDecoder(r.Body).Decode(&postRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = postRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextPostKey{}, postRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
