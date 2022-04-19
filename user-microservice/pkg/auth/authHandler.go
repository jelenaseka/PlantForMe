package auth

import (
	"encoding/json"
	"log"
	"net/http"
	"user-microservise/pkg/dto"
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

	json.NewEncoder(w).Encode(dto.NewUserWithToken(user.Username, user.Role, bearer))
	w.WriteHeader(http.StatusOK)
}

func (this *AuthHandler) Registration(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Registration")
	w.Header().Add("Content-Type", "application/json")

	registerUserRequest := r.Context().Value(ContextRegisterUserKey{}).(dto.RegisterUserRequest)

	id, err := this.IAuthService.Registration(&registerUserRequest)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(id)
	w.WriteHeader(http.StatusCreated)
}

func (this *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Me")
	w.Header().Add("Content-Type", "application/json")

	var principal Principal

	_ = json.NewDecoder(r.Body).Decode(&principal)

	if principal.Username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	user, err := this.IAuthService.Me(principal.Username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	json.NewEncoder(w).Encode(user)
	w.WriteHeader(http.StatusOK)
}

func (this *AuthHandler) IsAuthorized(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Is authorized")
	w.Header().Add("Content-Type", "application/json")

	principal := r.Context().Value(ContextClaimsKey{}).(Principal)

	json.NewEncoder(w).Encode(principal)
	w.WriteHeader(http.StatusOK)
}
