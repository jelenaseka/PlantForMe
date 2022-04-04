package dto

import (
	"plant-microservice/pkg/data"

	"github.com/go-playground/validator/v10"
)

type CategoryRequest struct {
	Name string `json:"name" validate:"required"`
}

type CategoryResponse struct {
	ID   string `json:"id" validate:"required,uuid"`
	Name string `json:"name" validate:"required"`
}

func (c *CategoryRequest) Validate() error {
	validate := validator.New()

	return validate.Struct(c)
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
