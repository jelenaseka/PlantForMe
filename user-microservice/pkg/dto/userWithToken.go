package dto

import "user-microservise/pkg/data"

type UserWithToken struct {
	Username string    `json:"username"`
	Role     data.Role `json:"role"`
	Token    string    `json:"token"`
}

func NewUserWithToken(username string, role data.Role, token string) *UserWithToken {
	return &UserWithToken{
		Username: username,
		Role:     role,
		Token:    token,
	}
}
