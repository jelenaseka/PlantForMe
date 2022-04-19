package repository

import (
	"forum-microservice/pkg/config"
	"forum-microservice/pkg/data"

	"github.com/google/uuid"
)

type postRepository struct {
}

type PostRepositoryInterface interface {
	FindAll() ([]data.Post, error)
	FindById(id uuid.UUID) (*data.Post, error)
	Create(post *data.Post) error
	Update(post *data.Post) error
	Delete(id uuid.UUID)
}

func NewPostRepository() PostRepositoryInterface {
	return &postRepository{}
}

func (this *postRepository) FindAll() ([]data.Post, error) {
	db := config.GetDB()
	var posts []data.Post
	result := db.Debug().Find(&posts)

	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) FindAllWithComments() ([]data.Post, error) {
	db := config.GetDB()
	var posts []data.Post
	result := db.Preload("Comments").Find(&posts)

	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) FindById(id uuid.UUID) (*data.Post, error) {
	db := config.GetDB()
	var post data.Post
	result := db.Preload("Comments").First(&post, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &post, nil
}

func (this *postRepository) Create(post *data.Post) error {
	db := config.GetDB()
	result := db.Create(&post)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *postRepository) Update(post *data.Post) error {
	db := config.GetDB()
	result := db.Save(&post)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *postRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Post{}, "id = ?", id.String())
}
