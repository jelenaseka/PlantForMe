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
	GetCommentsCountByPostId(id string) (int, error)
	GetCommentsByPostIdPageable(page int, postId string) ([]data.Comment, error)
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

func (this *commentRepository) GetCommentsCountByPostId(id string) (int, error) {
	db := config.GetDB()
	var count int
	query := "select count(c.id) from forumdb.comments c where c.post_id = '" + id + "';"

	result := db.Debug().Raw(query).Scan(&count)

	if result.Error != nil {
		return 0, result.Error
	}

	return count, nil
}

func (this *commentRepository) GetCommentsByPostIdPageable(page int, postId string) ([]data.Comment, error) {
	db := config.GetDB()
	limit := 3
	offset := limit * (page - 1)

	var comments []data.Comment
	result := db.Debug().Where("post_id = ?", postId).Order("created_at").Limit(limit).Offset(offset).Find(&comments)

	if result.Error != nil {
		return nil, result.Error
	}

	return comments, nil
}
