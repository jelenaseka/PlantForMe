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

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	user, err := this.IAuthService.Me(username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	userResponse := dto.ConvertUserToUserResponse(user)

	json.NewEncoder(w).Encode(userResponse)
	w.WriteHeader(http.StatusOK)
}

func (this *AuthHandler) IsAuthorized(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Is authorized")
	w.Header().Add("Content-Type", "application/json")

	principal := r.Context().Value(ContextClaimsKey{}).(Principal)
	this.l.Print("princ:username: ", principal.Username)

	json.NewEncoder(w).Encode(principal)
	w.WriteHeader(http.StatusOK)
}

func (this *AuthHandler) ChangeUsername(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Update username of the current user")

	var user dto.ChangeUsernameRequest

	_ = json.NewDecoder(r.Body).Decode(&user)

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	returnedUser, err := this.IAuthService.ChangeUsername(user.NewUsername, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
		return
	}

	token, err := this.IAuthService.IssueToken(returnedUser)
	var bearer = "Bearer " + token

	json.NewEncoder(w).Encode(dto.NewUserWithToken(returnedUser.Username, returnedUser.Role, bearer))
	w.WriteHeader(http.StatusOK)

}

func (this *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Update password of the current user")

	var user dto.ChangePasswordRequest

	_ = json.NewDecoder(r.Body).Decode(&user)

	username := r.Header["Username"][0]

	if username == "" {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	_, err := this.IAuthService.ChangePassword(user.NewPassword, username)
	if err != nil {
		http.Error(w, err.Message(), err.Status())
	}
}
