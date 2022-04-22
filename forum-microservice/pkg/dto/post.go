package dto

import (
	"forum-microservice/pkg/data"
	"time"

	"github.com/go-playground/validator"
)

type PostRequest struct {
	Heading    string `json:"heading" validate:"required"`
	Content    string `json:"content" validate:"required"`
	Username   string `json:"username" validate:"required"`
	CategoryID string `json:"categoryID" validate:"required, uuid"`
}

func (pr *PostRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(pr)
}

type PostResponseWithComments struct {
	ID         string `json:"id"`
	Heading    string `json:"heading"`
	Content    string `json:"content"`
	Username   string `json:"username"`
	CategoryID string `json:"categoryID"`
	Comments   []CommentResponse
}

type PostResponse struct {
	ID               string            `json:"id"`
	Heading          string            `json:"heading"`
	Content          string            `json:"content"`
	Username         string            `json:"username"`
	CategoryResponse *CategoryResponse `json:"categoryResponse"`
	CreatedAt        string
}

type PostCountCommentsResponse struct {
	ID            string `json:"id"`
	Heading       string `json:"heading"`
	Content       string `json:"content"`
	Username      string `json:"username"`
	CategoryID    string `json:"categoryID"`
	CommentsCount int    `json:"commentsCount"`
	CreatedAt     string `json:"createdAt"`
}

func NewPostResponse(post data.Post) *PostResponse {
	categoryResponse := NewCategoryResponse(post.Category.ID.String(), post.Category.Name)
	return &PostResponse{
		ID:               post.ID.String(),
		Heading:          post.Heading,
		Content:          post.Content,
		Username:         post.Username,
		CategoryResponse: categoryResponse,
		CreatedAt:        post.CreatedAt.Format(time.ANSIC),
	}
}

func NewPostCountCommentsResponse(post data.PostCountComments) *PostCountCommentsResponse {
	return &PostCountCommentsResponse{
		ID:            post.ID.String(),
		Heading:       post.Heading,
		Content:       post.Content,
		Username:      post.Username,
		CategoryID:    post.CategoryID.String(),
		CommentsCount: post.CommentsCount,
		CreatedAt:     post.CreatedAt.Format(time.ANSIC),
	}
}

func ConvertPostToPostResponseWithComments(post *data.Post) *PostResponseWithComments {
	commentsResponse := make([]CommentResponse, 0)
	for _, v := range post.Comments {
		commentsResponse = append(commentsResponse, *NewCommentResponse(v))
	}
	return &PostResponseWithComments{
		ID:         post.ID.String(),
		Heading:    post.Heading,
		Content:    post.Content,
		Username:   post.Username,
		Comments:   commentsResponse,
		CategoryID: post.CategoryID.String(),
	}
}
