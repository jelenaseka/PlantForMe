package handlers

import (
	"context"
	"encoding/json"
	"forum-microservice/pkg/dto"
	"net/http"
)

type ContextPostKey struct{}
type ContextCommentKey struct{}
type ContextCategoryKey struct{}

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

func (p *CommentHandler) MiddlewareCommentValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var commentRequest dto.CommentRequest
		err := json.NewDecoder(r.Body).Decode(&commentRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = commentRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), ContextCommentKey{}, commentRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func (c *CategoryHandler) MiddlewareCategoryValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

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
