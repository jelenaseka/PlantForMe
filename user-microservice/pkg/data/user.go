package data

import (
	"encoding/json"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:varchar(36)"`
	Username string    `gorm:"type:varchar(255)"`
	Password string    `gorm:"type:varchar(64)"`
	Role     Role
}

func NewUser(id uuid.UUID, username string, password string, role Role) *User {
	return &User{
		ID:       id,
		Username: username,
		Password: password,
		Role:     role,
	}
}

func (u User) String() string {
	out, err := json.Marshal(u)
	if err != nil {
		panic(err)
	}

	return string(out)
}
