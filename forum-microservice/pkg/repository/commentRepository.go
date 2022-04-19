package repository

import (
	"forum-microservice/pkg/config"
	"forum-microservice/pkg/data"

	"github.com/google/uuid"
)

type commentRepository struct {
}

type CommentRepositoryInterface interface {
	FindAll() ([]data.Comment, error)
	FindById(id uuid.UUID) (*data.Comment, error)
	Create(comment *data.Comment) error
	Update(comment *data.Comment) error
	Delete(id uuid.UUID)
}

func NewCommentRepository() CommentRepositoryInterface {
	return &commentRepository{}
}

func (this *commentRepository) FindAll() ([]data.Comment, error) {
	db := config.GetDB()
	var comments []data.Comment
	result := db.Debug().Find(&comments)

	if result.Error != nil {
		return nil, result.Error
	}

	return comments, nil
}

func (this *commentRepository) FindById(id uuid.UUID) (*data.Comment, error) {
	db := config.GetDB()
	var comment data.Comment
	result := db.First(&comment, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &comment, nil
}

func (this *commentRepository) Create(comment *data.Comment) error {
	db := config.GetDB()
	result := db.Create(&comment)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *commentRepository) Update(comment *data.Comment) error {
	db := config.GetDB()
	result := db.Save(&comment)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *commentRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Comment{}, "id = ?", id.String())
}
