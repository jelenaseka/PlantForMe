package config

import (
	"github.com/spf13/viper"
)

type Configurations struct {
	ServerAddress   string `mapstructure:"SERVER_ADDRESS"`
	UserAddress     string `mapstructure:"USER_MICROSERVICE_SERVER_ADDRESS"`
	PlantAddress    string `mapstructure:"PLANT_MICROSERVICE_SERVER_ADDRESS"`
	ForumAddress    string `mapstructure:"FORUM_MICROSERVICE_SERVER_ADDRESS"`
	FrontendAddress string `mapstructure:"FRONTEND_ADDRESS"`
}

func LoadConfig(path string) (config Configurations, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("config")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
