package service

import (
	"errors"
	"fmt"
	"forum-microservice/pkg/data"
	"forum-microservice/pkg/dto"
	"forum-microservice/pkg/repository"
	"forum-microservice/pkg/utils/error_utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type postService struct {
	IPostRepository repository.PostRepositoryInterface
}

type PostServiceInterface interface {
	GetAll() ([]dto.PostResponse, error_utils.MessageErr)
	GetOneById(id uuid.UUID) (*dto.PostResponseWithComments, error_utils.MessageErr)
	Create(postRequest *dto.PostRequest) (*uuid.NullUUID, error_utils.MessageErr)
	Update(postRequest *dto.PostRequest, id uuid.UUID) error_utils.MessageErr
	Delete(id uuid.UUID) error_utils.MessageErr
}

func NewPostService(r repository.PostRepositoryInterface) PostServiceInterface {
	return &postService{r}
}

func (this *postService) GetAll() ([]dto.PostResponse, error_utils.MessageErr) {
	posts, err := this.IPostRepository.FindAll()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve posts: %s", err.Error()))
	}

	postsResponse := make([]dto.PostResponse, 0)
	for _, v := range posts {
		postsResponse = append(postsResponse, *dto.NewPostResponse(v))
	}
	return postsResponse, nil
}

func (this *postService) GetOneById(id uuid.UUID) (*dto.PostResponseWithComments, error_utils.MessageErr) {
	post, err := this.IPostRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The post with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve post: %s", err.Error()))
		}

	}

	postResponse := dto.ConvertPostToPostResponseWithComments(post)

	return postResponse, nil
}

func (this *postService) Create(postRequest *dto.PostRequest) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()

	post := data.NewPost(id, postRequest.Heading, postRequest.Content, postRequest.Username)

	//validacija za username

	err := this.IPostRepository.Create(post)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create post: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (this *postService) Update(postRequest *dto.PostRequest, id uuid.UUID) error_utils.MessageErr {
	post := data.NewPost(id, postRequest.Heading, postRequest.Content, postRequest.Username)

	_, err := this.IPostRepository.FindById(post.ID)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The post with the id %s is not found in the database.", id.String()))
	}

	err = this.IPostRepository.Update(post)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update post: %s", err.Error()))
	}
	return nil
}

func (this *postService) Delete(id uuid.UUID) error_utils.MessageErr {
	_, err := this.IPostRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The post with the id %s is not found in the database.", id.String()))
	}

	this.IPostRepository.Delete(id)
	return nil
}
