package data

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	ID         uuid.UUID `gorm:"type:varchar(36)"`
	Heading    string    `gorm:"type:varchar(255);unique"`
	Content    string
	Username   string
	CategoryID uuid.UUID `gorm:"type:varchar(36)"`
	Category   Category
	Comments   []Comment
}

type PostCountComments struct {
	ID            uuid.UUID
	Heading       string
	Content       string
	Username      string
	CategoryID    uuid.UUID
	CommentsCount int
	CreatedAt     time.Time
}

func NewPost(id uuid.UUID, heading string, content string, username string, categoryID uuid.UUID) *Post {
	return &Post{
		ID:         id,
		Heading:    heading,
		Content:    content,
		Username:   username,
		CategoryID: categoryID,
	}
}

func (p *Post) String() string {
	out, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}

	return string(out)
}
