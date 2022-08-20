package handlers

import (
	"log"
	"net/http"
	"os"
)

type LogsHandler struct {
}

func NewLogsHandler() *LogsHandler {
	return &LogsHandler{}
}

func (this *LogsHandler) GetLogs(w http.ResponseWriter, r *http.Request) {
	log.Print("Get all logs")

	content, err := os.ReadFile("../../logs/logs.txt")
	if err != nil {
		log.Fatal(err)
	}

	log.Println(string(content))

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/text")

	w.Write([]byte(string(content)))

	// f, err := os.OpenFile("../../logs/logs.txt",
	// 	os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	// if err != nil {
	// 	log.Println(err)
	// }
	// defer f.Close()

	// _, err2 := f.WriteString("old falcon\n")

	// if err2 != nil {
	// 	log.Fatal(err2)
	// }

}
