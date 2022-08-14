package repository

import (
	"plantcare-microservice/pkg/config"
	"plantcare-microservice/pkg/data"

	"github.com/google/uuid"
)

type taskRepository struct {
}

type TaskRepositoryInterface interface {
	FindById(id uuid.UUID) (*data.Task, error)
	FindAllByCollectionPlantId(collectionPlantId uuid.UUID) ([]data.Task, error)
	Create(task *data.Task) error
	Update(task *data.Task) error
	Delete(id uuid.UUID)
	SetTaskToDone(id uuid.UUID) error
}

func NewTaskRepository() TaskRepositoryInterface {
	return &taskRepository{}
}

func (this *taskRepository) FindById(id uuid.UUID) (*data.Task, error) {
	db := config.GetDB()
	var task data.Task
	result := db.First(&task, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &task, nil
}

func (this *taskRepository) FindAllByCollectionPlantId(collectionPlantId uuid.UUID) ([]data.Task, error) {
	db := config.GetDB()
	var tasks []data.Task
	result := db.Where("collection_plant_id = ?", collectionPlantId).Find(&tasks).Order("date desc")

	if result.Error != nil {
		return nil, result.Error
	}

	return tasks, nil
}

func (this *taskRepository) Create(task *data.Task) error {
	db := config.GetDB()
	result := db.Create(&task)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *taskRepository) Update(task *data.Task) error {
	db := config.GetDB()
	result := db.Save(&task)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *taskRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Task{}, "id = ?", id.String())
}

func (this *taskRepository) SetTaskToDone(id uuid.UUID) error {
	db := config.GetDB()
	result := db.Model(&data.Task{}).Where("id = ?", id).Update("status", data.DONE)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
