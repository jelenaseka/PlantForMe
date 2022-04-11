package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"user-microservise/pkg/utils/error_utils"

	"github.com/dgrijalva/jwt-go"
)

type ContextUserCredentialsKey struct{}
type ContextClaimsKey struct{}

func (u *AuthHandler) MiddlewareUserCredentialsValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var credentials Credentials
		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = credentials.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		ctx := context.WithValue(r.Context(), ContextUserCredentialsKey{}, credentials)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func (u *AuthHandler) MiddlewareAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.Header["Authorization"] != nil {

			authStr := r.Header["Authorization"][0]
			authStrParts := strings.Split(authStr, " ")
			if authStrParts[0] != "Bearer" {
				http.Error(w, error_utils.NewBadRequestError("Bad authorization header.").Error(), http.StatusBadRequest)
				return
			}
			tokenStr := authStrParts[1]

			claims := &Claims{}

			tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
				return jwtKey, nil
			})

			if err != nil {
				if err == jwt.ErrSignatureInvalid {
					w.WriteHeader(http.StatusUnauthorized)
					return
				}
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			if !tkn.Valid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), ContextClaimsKey{}, claims.Username)
			r = r.WithContext(ctx)

			next.ServeHTTP(w, r)

		} else {
			w.WriteHeader(http.StatusUnauthorized)
		}
	})
}
