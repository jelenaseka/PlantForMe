package config

import (
	"github.com/spf13/viper"
)

type Configurations struct {
	ServerAddress string `mapstructure:"SERVER_ADDRESS"`
	DBName        string `mapstructure:"DB_NAME"`
	DBUser        string `mapstructure:"DB_USER"`
	DBPassword    string `mapstructure:"DB_PASSWORD"`
	DSN           string `mapstructure:"DSN"`
	JWTSecretKey  string `mapstructure:"JWT_SECRET_KEY"`
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
