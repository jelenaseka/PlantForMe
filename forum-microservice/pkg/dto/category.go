package dto

import (
	"forum-microservice/pkg/data"

	"github.com/go-playground/validator"
)

type CategoryRequest struct {
	Name string `json:"name" validate:"required"`
}

type CategoryResponse struct {
	ID   string `json:"id" validate:"required,uuid"`
	Name string `json:"name" validate:"required"`
}

type CategoryCountPostsResponse struct {
	ID         string `json:"id" validate:"required,uuid"`
	Name       string `json:"name" validate:"required"`
	PostsCount int    `json:"postsCount"`
}

func (c *CategoryRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(c)
}

func NewCategoryCountPostsResponse(id string, name string, posts int) *CategoryCountPostsResponse {
	return &CategoryCountPostsResponse{
		ID:         id,
		Name:       name,
		PostsCount: posts,
	}
}

func NewCategoryResponse(id string, name string) *CategoryResponse {
	return &CategoryResponse{
		ID:   id,
		Name: name,
	}
}

func NewCategoryResponseFromCategory(cat data.Category) *CategoryResponse {
	return &CategoryResponse{
		ID:   cat.ID.String(),
		Name: cat.Name,
	}
}

func ConvertCategoryToCategoryResponse(cat *data.Category) *CategoryResponse {
	return NewCategoryResponse(cat.ID.String(), cat.Name)
}
