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

type commentService struct {
	ICommentRepository repository.CommentRepositoryInterface
	IPostService       PostServiceInterface
}

type CommentServiceInterface interface {
	GetAll() ([]dto.CommentResponse, error_utils.MessageErr)
	GetOneById(id uuid.UUID) (*dto.CommentResponse, error_utils.MessageErr)
	Create(commentRequest *dto.CommentRequest, username string) (*uuid.NullUUID, error_utils.MessageErr)
	Update(commentRequest *dto.CommentRequest, id uuid.UUID, username string) error_utils.MessageErr
	Delete(id uuid.UUID, username string) error_utils.MessageErr
	GetCommentsCountByPostId(id string) (int, error_utils.MessageErr)
	GetCommentsByPostIdPageable(page int, postId string) ([]dto.CommentResponse, error_utils.MessageErr)
}

func NewCommentService(r repository.CommentRepositoryInterface, s PostServiceInterface) CommentServiceInterface {
	return &commentService{r, s}
}

func (this *commentService) GetAll() ([]dto.CommentResponse, error_utils.MessageErr) {
	comments, err := this.ICommentRepository.FindAll()

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve comments: %s", err.Error()))
	}

	commentsResponse := make([]dto.CommentResponse, 0)
	for _, v := range comments {
		commentsResponse = append(commentsResponse, *dto.NewCommentResponse(v))
	}
	return commentsResponse, nil
}

func (this *commentService) GetOneById(id uuid.UUID) (*dto.CommentResponse, error_utils.MessageErr) {
	comment, err := this.ICommentRepository.FindById(id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, error_utils.NewNotFoundError(fmt.Sprintf("The comment with the id %s is not found in the database.", id.String()))
		} else {
			return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve comment: %s", err.Error()))
		}

	}

	commentResponse := dto.ConvertCommentToCommentResponse(comment)

	return commentResponse, nil
}

func (this *commentService) Create(commentRequest *dto.CommentRequest, username string) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()

	comment := data.NewComment(id, commentRequest.Content, username, uuid.Must(uuid.Parse(commentRequest.PostID)))

	_, err := this.IPostService.GetOneById(uuid.Must(uuid.Parse(commentRequest.PostID)))
	if err != nil {
		return nil, error_utils.NewConflictError(fmt.Sprintf("Post with the id %s does not exists in the database.", commentRequest.PostID))
	}

	//validacija za username

	error := this.ICommentRepository.Create(comment)
	if error != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create comment: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (this *commentService) Update(commentRequest *dto.CommentRequest, id uuid.UUID, username string) error_utils.MessageErr {
	comment := data.NewComment(id, commentRequest.Content, username, uuid.Must(uuid.Parse(commentRequest.PostID)))

	_, err := this.IPostService.GetOneById(uuid.Must(uuid.Parse(commentRequest.PostID)))
	if err != nil {
		return error_utils.NewConflictError(fmt.Sprintf("Post with the id %s does not exists in the database.", commentRequest.PostID))
	}

	foundComment, error := this.ICommentRepository.FindById(comment.ID)
	if error != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The comment with the id %s is not found in the database.", id.String()))
	}

	if foundComment.PostID.String() != commentRequest.PostID {
		return error_utils.NewConflictError(fmt.Sprintf("Comment with the id %s not on the right post.", id))
	}

	if foundComment.Username != username {
		return error_utils.NewConflictError(fmt.Sprintf("User %s who is trying to edit post not right", username))
	}

	error = this.ICommentRepository.Update(comment)
	if error != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update comment: %s", err.Error()))
	}
	return nil
}

func (this *commentService) Delete(id uuid.UUID, username string) error_utils.MessageErr {
	foundComment, err := this.ICommentRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The comment with the id %s is not found in the database.", id.String()))
	}

	if foundComment.Username != username {
		error_utils.NewConflictError(fmt.Sprintf("The user with the username %s does not have permission to delete the comment.", foundComment.Username))
	}

	this.ICommentRepository.Delete(id)
	return nil
}

func (this *commentService) GetCommentsCountByPostId(id string) (int, error_utils.MessageErr) {
	count, err := this.ICommentRepository.GetCommentsCountByPostId(id)
	if err != nil {
		return 0, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve posts: %s", err.Error()))
	}
	return count, nil
}

func (this *commentService) GetCommentsByPostIdPageable(page int, postId string) ([]dto.CommentResponse, error_utils.MessageErr) {
	comments, err := this.ICommentRepository.GetCommentsByPostIdPageable(page, postId)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve posts: %s", err.Error()))
	}

	commentsResponse := make([]dto.CommentResponse, 0)
	for _, v := range comments {
		commentsResponse = append(commentsResponse, *dto.NewCommentResponse(v))
	}
	return commentsResponse, nil
}
