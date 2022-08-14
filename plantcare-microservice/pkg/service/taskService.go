package service

import (
	"fmt"
	"plantcare-microservice/pkg/data"
	"plantcare-microservice/pkg/dto"
	"plantcare-microservice/pkg/repository"
	"plantcare-microservice/pkg/utils/error_utils"

	"github.com/google/uuid"
)

type taskService struct {
	ITaskRepository repository.TaskRepositoryInterface
}

type TaskServiceInterface interface {
	GetAllByCollectionPlantId(collectionPlantId uuid.UUID) ([]dto.TaskResponse, error_utils.MessageErr)
	Create(taskRequest *dto.TaskRequest, username string) (*uuid.NullUUID, error_utils.MessageErr)
	Delete(id uuid.UUID, username string) error_utils.MessageErr
	SetTaskToDone(id uuid.UUID, username string) error_utils.MessageErr
}

func NewTaskService(r repository.TaskRepositoryInterface) TaskServiceInterface {
	return &taskService{r}
}

func (this *taskService) GetAllByCollectionPlantId(collectionPlantId uuid.UUID) ([]dto.TaskResponse, error_utils.MessageErr) {
	tasks, err := this.ITaskRepository.FindAllByCollectionPlantId(collectionPlantId)

	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to retrieve tasks: %s", err.Error()))
	}

	tasksResponse := make([]dto.TaskResponse, 0)
	for _, v := range tasks {
		tasksResponse = append(tasksResponse, *dto.NewTaskResponse(v.ID, v.CollectionPlantID, v.Type, v.Status, v.Date, v.Notes))
	}

	return tasksResponse, nil
}

func (this *taskService) Create(taskRequest *dto.TaskRequest, username string) (*uuid.NullUUID, error_utils.MessageErr) {
	id := uuid.New()
	task := data.NewTask(id, uuid.Must(uuid.Parse(taskRequest.CollectionPlantID)), taskRequest.Type, data.WAITING, taskRequest.Date, taskRequest.Notes)

	//todo check username
	err := this.ITaskRepository.Create(task)
	if err != nil {
		return nil, error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to create task: %s", err.Error()))
	}

	return &uuid.NullUUID{UUID: id, Valid: true}, nil
}

func (this *taskService) Delete(id uuid.UUID, username string) error_utils.MessageErr {
	_, err := this.ITaskRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The task with the id %s is not found in the database.", id.String()))
	}
	// if collection.Username != username {
	// 	return error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	// }

	this.ITaskRepository.Delete(id)
	return nil
}

func (this *taskService) SetTaskToDone(id uuid.UUID, username string) error_utils.MessageErr {
	_, err := this.ITaskRepository.FindById(id)
	if err != nil {
		return error_utils.NewNotFoundError(fmt.Sprintf("The task with the id %s is not found in the database.", id.String()))
	}
	// if collection.Username != username {
	// 	return error_utils.NewForbiddenError("You are unauthorized to perform this operation")
	// }

	err = this.ITaskRepository.SetTaskToDone(id)
	if err != nil {
		return error_utils.NewInternalServerError(fmt.Sprintf("Error when trying to update task: %s", err.Error()))
	}
	return nil
}
