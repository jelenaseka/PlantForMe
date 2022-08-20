package handlers

import (
	"log"
	"net/http"
	"plant-microservice/pkg/service"
)

type LogsHandler struct {
	ILogsService service.LogsServiceInterface
}

func NewLogsHandler(s service.LogsServiceInterface) *LogsHandler {
	return &LogsHandler{s}
}

func (this *LogsHandler) GetLogs(w http.ResponseWriter, r *http.Request) {
	log.Print("Get all logs")

	logs := this.ILogsService.GetLogs()
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/text")

	w.Write([]byte(logs))

}
