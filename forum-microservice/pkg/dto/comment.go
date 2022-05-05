package dto

import (
	"forum-microservice/pkg/data"
	"time"

	"github.com/go-playground/validator"
)

type CommentRequest struct {
	Content  string `json:"content" validate:"required"`
	Username string `json:"username" validate:"required"`
	PostID   string `json:"postID" validate:"required,uuid"`
}

func (cr *CommentRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(cr)
}

type CommentResponse struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	Username  string `json:"username"`
	PostID    string `json:"postID"`
	CreatedAt string `json:"createdAt"`
}

func NewCommentResponse(comment data.Comment) *CommentResponse {
	return &CommentResponse{
		ID:        comment.ID.String(),
		Content:   comment.Content,
		Username:  comment.Username,
		PostID:    comment.PostID.String(),
		CreatedAt: comment.CreatedAt.Format(time.ANSIC),
	}
}

func ConvertCommentToCommentResponse(comment *data.Comment) *CommentResponse {
	return &CommentResponse{
		ID:       comment.ID.String(),
		Content:  comment.Content,
		Username: comment.Username,
		PostID:   comment.PostID.String(),
	}
}
