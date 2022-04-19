package dto

import (
	"forum-microservice/pkg/data"

	"github.com/go-playground/validator"
)

type PostRequest struct {
	Heading  string `json:"heading" validate:"required"`
	Content  string `json:"content" validate:"required"`
	Username string `json:"username" validate:"required"`
}

func (pr *PostRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(pr)
}

type PostResponseWithComments struct {
	ID       string `json:"id"`
	Heading  string `json:"heading"`
	Content  string `json:"content"`
	Username string `json:"username"`
	Comments []CommentResponse
}

type PostResponse struct {
	ID       string `json:"id"`
	Heading  string `json:"heading"`
	Content  string `json:"content"`
	Username string `json:"username"`
}

func NewPostResponse(post data.Post) *PostResponse {
	return &PostResponse{
		ID:       post.ID.String(),
		Heading:  post.Heading,
		Content:  post.Content,
		Username: post.Username,
	}
}

func ConvertPostToPostResponseWithComments(post *data.Post) *PostResponseWithComments {
	commentsResponse := make([]CommentResponse, 0)
	for _, v := range post.Comments {
		commentsResponse = append(commentsResponse, *NewCommentResponse(v))
	}
	return &PostResponseWithComments{
		ID:       post.ID.String(),
		Heading:  post.Heading,
		Content:  post.Content,
		Username: post.Username,
		Comments: commentsResponse,
	}
}
