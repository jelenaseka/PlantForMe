package service

import (
	"log"
	"os"
	"time"

	"github.com/google/uuid"
)

type logsService struct {
}

type LogsServiceInterface interface {
	Log(string)
	GetLogs() string
	CreateLogLine(string, string, uuid.UUID) string
}

func NewLogsService() LogsServiceInterface {
	return &logsService{}
}

func (this *logsService) CreateLogLine(username string, operation string, id uuid.UUID) string {
	now := time.Now()
	logs := "\n" + now.Format("01/01/2006") + "," + username + "," + operation + "," + id.String()
	return logs
}

func (this *logsService) Log(logs string) {

	f, err := os.OpenFile("../../logs/logs.txt",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()

	_, err2 := f.WriteString(logs)

	if err2 != nil {
		log.Fatal(err2)
	}
}

func (this *logsService) GetLogs() string {
	content, err := os.ReadFile("../../logs/logs.txt")
	if err != nil {
		log.Fatal(err)
	}
	return string(content)
}
