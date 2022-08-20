package repository

import (
	"forum-microservice/pkg/config"
	"forum-microservice/pkg/data"
	"strconv"

	"github.com/google/uuid"
)

type postRepository struct {
}

type PostRepositoryInterface interface {
	FindAll() ([]data.Post, error)
	FindById(id uuid.UUID) (*data.Post, error)
	Create(post *data.Post) error
	Update(post *data.Post) error
	Delete(id uuid.UUID)
	FindAllCountComments() ([]data.PostCountComments, error)
	FindAllOrderByCreatedAt() ([]data.Post, error)
	FindAllByCategoryPageable(page int, category string) ([]data.PostCountComments, error)
	GetPostsCount(category string) (int, error)
	SetCategoryToNull(id uuid.UUID) error
}

func NewPostRepository() PostRepositoryInterface {
	return &postRepository{}
}

func (this *postRepository) FindAll() ([]data.Post, error) {
	db := config.GetDB()
	var posts []data.Post
	result := db.Debug().Preload("Category").Find(&posts)

	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) FindAllWithComments() ([]data.Post, error) {
	db := config.GetDB()
	var posts []data.Post
	result := db.Preload("Comments").Find(&posts)

	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) FindById(id uuid.UUID) (*data.Post, error) {
	db := config.GetDB()
	var post data.Post
	result := db.First(&post, "id = ?", id.String())

	if result.Error != nil {
		return nil, result.Error
	}

	return &post, nil
}

func (this *postRepository) Create(post *data.Post) error {
	db := config.GetDB()
	result := db.Create(&post)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *postRepository) Update(post *data.Post) error {
	db := config.GetDB()
	result := db.Save(&post)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (this *postRepository) Delete(id uuid.UUID) {
	db := config.GetDB()
	db.Debug().Delete(&data.Post{}, "id = ?", id.String())
}

func (this *postRepository) FindAllCountComments() ([]data.PostCountComments, error) {
	db := config.GetDB()
	var posts []data.PostCountComments
	result := db.Debug().Preload("Comments").Raw("select p.*, count(c.id) as comments_count from forumdb.posts p left join forumdb.comments c on p.id = c.post_id where p.deleted_at is null and c.deleted_at is null group by p.id order by comments_count desc limit 6;").Scan(&posts)

	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) FindAllOrderByCreatedAt() ([]data.Post, error) {
	db := config.GetDB()
	var posts []data.Post
	result := db.Debug().Preload("Category").Order("created_at desc").Limit(5).Find(&posts)
	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) FindAllByCategoryPageable(page int, category string) ([]data.PostCountComments, error) {
	db := config.GetDB()
	limit := 3
	offset := limit * (page - 1)

	query := "select p.*, count(c.id) as comments_count from forumdb.posts p left join forumdb.comments c on p.id = c.post_id left join forumdb.categories cat on cat.id = p.category_id where p.deleted_at is null and c.deleted_at is null "
	if category != "" {
		query += " and cat.name = '" + category + "'"
	}
	query += " group by p.id order by comments_count desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset) + ";"
	var posts []data.PostCountComments
	result := db.Debug().Preload("Comments").Raw(query).Scan(&posts)

	if result.Error != nil {
		return nil, result.Error
	}

	return posts, nil
}

func (this *postRepository) GetPostsCount(category string) (int, error) {
	db := config.GetDB()
	var count int
	query := "select count(p.id) from forumdb.posts p left join forumdb.categories cat on cat.id = p.category_id where p.deleted_at is null "
	if category != "" {
		query += " and cat.name = '" + category + "';"
	}
	result := db.Debug().Raw(query).Scan(&count)

	if result.Error != nil {
		return 0, result.Error
	}

	return count, nil
}

func (this *postRepository) SetCategoryToNull(categoryId uuid.UUID) error {
	db := config.GetDB()
	result := db.Debug().Model(&data.Post{}).Where("category_id = ?", categoryId.String()).Update("category_id", nil)

	if result.Error != nil {
		return result.Error
	}
	return nil
}
