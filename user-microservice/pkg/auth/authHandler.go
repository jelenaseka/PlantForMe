package auth

import (
	"encoding/json"
	"log"
	"net/http"
)

type AuthHandler struct {
	l            *log.Logger
	IAuthService AuthServiceInterface
}

func NewAuthHandler(l *log.Logger, a AuthServiceInterface) *AuthHandler {
	return &AuthHandler{l, a}
}

func (this *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Login")
	w.Header().Add("Content-Type", "application/json")

	userCredentials := r.Context().Value(ContextUserCredentialsKey{}).(Credentials)

	user, err := this.IAuthService.ValidateCredentials(userCredentials)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	token, err := this.IAuthService.IssueToken(user)
	var bearer = "Bearer " + token

	json.NewEncoder(w).Encode(bearer)
	w.WriteHeader(http.StatusOK)
}

func (this *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Me")
	w.Header().Add("Content-Type", "application/json")

	username := r.Context().Value(ContextClaimsKey{}).(string)

	user, err := this.IAuthService.Me(username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(user)
	w.WriteHeader(http.StatusOK)
}
