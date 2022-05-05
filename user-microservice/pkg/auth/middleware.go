package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"user-microservise/pkg/dto"
	"user-microservise/pkg/utils/error_utils"

	"github.com/casbin/casbin/v2"
	"github.com/dgrijalva/jwt-go"
)

type ContextUserCredentialsKey struct{}
type ContextClaimsKey struct{}
type ContextRegisterUserKey struct{}

func MiddlewareAuthentication(next http.Handler) http.Handler {
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
				return JwtKey, nil
			})

			fmt.Println("claims: ", claims.Username)

			if err != nil {
				if err == jwt.ErrSignatureInvalid {
					w.WriteHeader(http.StatusUnauthorized)
					return
				}
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			if !tkn.Valid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), ContextClaimsKey{}, NewPrincipal(claims.Username, claims.Role))
			r = r.WithContext(ctx)

		} else {
			ctx := context.WithValue(r.Context(), ContextClaimsKey{}, NewPrincipal("", 0))
			r = r.WithContext(ctx)
		}

		next.ServeHTTP(w, r)
	})
}

func MiddlewareAuthorizationFromAPIGateway(cas *casbin.Enforcer) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Println("Middleware AuthorizationFromAPIGateway called")

			if r.Header["Requested-Api"] == nil || r.Header["Requested-Method"] == nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			ra := r.Header["Requested-Api"][0]
			meth := r.Header["Requested-Method"][0]

			principal := r.Context().Value(ContextClaimsKey{}).(Principal)

			sub := principal.Role.String()
			obj := ra
			act := meth

			fmt.Println(sub, obj, act)

			if res, _ := cas.Enforce(sub, obj, act); res {
				ctx := context.WithValue(r.Context(), ContextClaimsKey{}, principal)
				r = r.WithContext(ctx)
				next.ServeHTTP(w, r)
			} else {

				if sub == "Public" {
					w.WriteHeader(http.StatusUnauthorized)
					w.Write([]byte("Not authorized"))
				} else {
					w.WriteHeader(http.StatusForbidden)
					w.Write([]byte("Forbidden"))
				}

				return
			}

		})
	}
}

func (u *AuthHandler) MiddlewareRegisterUserValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var registerUserRequest dto.RegisterUserRequest
		err := json.NewDecoder(r.Body).Decode(&registerUserRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = registerUserRequest.Validate()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		ctx := context.WithValue(r.Context(), ContextRegisterUserKey{}, registerUserRequest)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

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
