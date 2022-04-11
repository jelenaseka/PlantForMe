package repository

import (
	"user-microservise/pkg/config"
	"user-microservise/pkg/data"

	"github.com/google/uuid"
)

type userRepository struct {
}

type UserRepositoryInterface interface {
	FindAll() ([]data.User, error)
	FindById(id uuid.UUID) (*data.User, error)
	FindByUsername(name string) (*data.User, error)
	Create(user *data.User) error
	Update(user *data.User) error
	Delete(id uuid.UUID)
}

func NewUserRepository() UserRepositoryInterface {
	return &userRepository{}
}

func (this *userRepository) FindAll() ([]data.User, error) {
	db := config.GetDB()
	var users []data.User
	result := db.Debug().Find(&users)

	if result.Error != nil {
		return nil, result.Error
	}

	return users, nil
}

func (this *userRepository) FindById(id uuid.UUID) (*data.User, error) {
	db := config.GetDB()
	var user data.User
	result := db.First(&user, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func (this *userRepository) FindByUsername(name string) (*data.User, error) {
	db := config.GetDB()
	var user data.User
	result := db.First(&user, "username = ?", name)

	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func (this *userRepository) Create(user *data.User) error {
	db := config.GetDB()
	result := db.Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *userRepository) Update(user *data.User) error {
	db := config.GetDB()
	result := db.Save(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *userRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.User{}, "id = ?", id.String())
}
