package config

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

func Connect() {
	dsn := "root:Admin123@tcp(127.0.0.1:3306)/plantdb?charset=utf8mb4&parseTime=True&loc=Local"
	d, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db = d
}

func GetDB() *gorm.DB {
	return db
}

func initDatabase() {
	// jan := data.BloomingMonth{
	// 	ID:    1,
	// 	Month: data.January,
	// }
	// feb := data.BloomingMonth{
	// 	ID:    2,
	// 	Month: data.February,
	// }

	// id := uuid.New()
	// cat := data.Category{
	// 	ID:   id,
	// 	Name: "cat1",
	// }
	// months := []data.BloomingMonth{jan, feb}
	// plant1 := data.Plant{
	// 	ID:             uuid.New(),
	// 	Name:           "Name 1",
	// 	Description:    "Desc 1",
	// 	CategoryID:     id,
	// 	Light:          data.Direct,
	// 	Watering:       data.Daily,
	// 	IsBlooming:     false,
	// 	BloomingMonths: months,
	// 	GrowthRate:     data.FastGrowing,
	// 	Hardiness:      data.Tender,
	// 	Height:         data.Small,
	// 	LifeTime:       data.Annuals,
	// 	CreatedAt:      time.Now(),
	// }

	// var plant data.Plant
	// db.Where("name = ?", "Name 1").First(&plant)
	// fmt.Printf("%v", plant)
}
