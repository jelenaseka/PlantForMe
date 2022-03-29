package config

import (
	"plant-microservice/pkg/data"
	"time"

	"github.com/google/uuid"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

func Connect(dsn string) {
	d, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db = d
}

func GetDB() *gorm.DB {
	return db
}

func InitDatabase(db *gorm.DB) {

	jan := data.BloomingMonth{
		ID:    1,
		Month: data.January,
	}
	feb := data.BloomingMonth{
		ID:    2,
		Month: data.February,
	}
	mar := data.BloomingMonth{
		ID:    3,
		Month: data.March,
	}
	apr := data.BloomingMonth{
		ID:    4,
		Month: data.April,
	}
	may := data.BloomingMonth{
		ID:    5,
		Month: data.May,
	}
	jun := data.BloomingMonth{
		ID:    6,
		Month: data.June,
	}
	jul := data.BloomingMonth{
		ID:    7,
		Month: data.July,
	}
	aug := data.BloomingMonth{
		ID:    8,
		Month: data.August,
	}
	sep := data.BloomingMonth{
		ID:    9,
		Month: data.September,
	}
	oct := data.BloomingMonth{
		ID:    10,
		Month: data.October,
	}
	nov := data.BloomingMonth{
		ID:    11,
		Month: data.November,
	}
	dec := data.BloomingMonth{
		ID:    12,
		Month: data.December,
	}

	var months = []data.BloomingMonth{jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec}

	cat1Id := uuid.New()
	cat2Id := uuid.New()
	cat1 := data.Category{
		ID:   cat1Id,
		Name: "cat1",
	}
	cat2 := data.Category{
		ID:   cat2Id,
		Name: "cat2",
	}
	plant1 := data.Plant{
		ID:             uuid.New(),
		Name:           "Name 1",
		Description:    "Desc 1",
		CategoryID:     cat1Id,
		Light:          data.Direct,
		Watering:       data.Daily,
		IsBlooming:     false,
		BloomingMonths: []data.BloomingMonth{jan, feb},
		GrowthRate:     data.FastGrowing,
		Hardiness:      data.Tender,
		Height:         data.Small,
		LifeTime:       data.Annuals,
		CreatedAt:      time.Now(),
	}

	plant2 := data.Plant{
		ID:             uuid.New(),
		Name:           "Name 2",
		Description:    "Desc 2",
		CategoryID:     cat2Id,
		Light:          data.Direct,
		Watering:       data.Daily,
		IsBlooming:     false,
		BloomingMonths: []data.BloomingMonth{feb, mar},
		GrowthRate:     data.FastGrowing,
		Hardiness:      data.Tender,
		Height:         data.Small,
		LifeTime:       data.Annuals,
		CreatedAt:      time.Now(),
	}

	db.Create(&cat1)
	db.Create(&cat2)
	db.CreateInBatches(months, 12)
	db.Create(&plant1)
	db.Create(&plant2)

}
