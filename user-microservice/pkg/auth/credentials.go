package auth

import (
	"user-microservise/pkg/data"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator"
)

type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

type Claims struct {
	Username string    `json:"username"`
	Role     data.Role `json:"role"`
	jwt.StandardClaims
}

type Principal struct {
	Username string
	Role     data.Role
}

func NewPrincipal(username string, role data.Role) Principal {
	return Principal{
		Username: username,
		Role:     role,
	}
}

func (c *Credentials) Validate() error {
	validate := validator.New()

	return validate.Struct(c)
}
