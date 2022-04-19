package data

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:varchar(36)"`
	Content  string
	Username string
	PostID   uuid.UUID `gorm:"type:varchar(36)"`
}

func NewComment(id uuid.UUID, content string, username string, postID uuid.UUID) *Comment {
	return &Comment{
		ID:       id,
		Content:  content,
		Username: username,
		PostID:   postID,
	}
}
