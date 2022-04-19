package data

import (
	"encoding/json"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:varchar(36)"`
	Heading  string    `gorm:"type:varchar(255);unique"`
	Content  string
	Username string
	Comments []Comment
}

func NewPost(id uuid.UUID, heading string, content string, username string) *Post {
	return &Post{
		ID:       id,
		Heading:  heading,
		Content:  content,
		Username: username,
	}
}

func (p *Post) String() string {
	out, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}

	return string(out)
}
