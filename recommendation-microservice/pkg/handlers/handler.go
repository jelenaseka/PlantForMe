package handlers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"recommendation-microservice/pkg/dto"
	"time"
)

type RecommendationHandler struct {
	l *log.Logger
}

func NewRecommendationHandler(l *log.Logger) *RecommendationHandler {
	return &RecommendationHandler{l}
}

func (this *RecommendationHandler) GetRecommendation(w http.ResponseWriter, r *http.Request) {

	headers := r.Header
	_, ok := headers["Username"]
	if !ok {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}
	username := r.Header["Username"][0]

	w.Header().Add("Content-Type", "application/json")

	client := &http.Client{
		Timeout: time.Second * 10,
	}

	req, _ := http.NewRequest(http.MethodGet, "http://localhost:8088/api/collectionplants/recommendation/referents", nil)

	req.Header.Add("Username", username)

	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	data, _ := ioutil.ReadAll(resp.Body)

	var referents = []byte(`{"referentIds":` + string(data) + `}`)
	req, _ = http.NewRequest(http.MethodPost, "http://localhost:8085/api/recommendation/referents", bytes.NewBuffer(referents))

	resp, err = client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {

		data, _ := ioutil.ReadAll(resp.Body)

		var plants []dto.Plant

		json.Unmarshal([]byte(string(data)), &plants)

		json.NewEncoder(w).Encode(plants)
	} else {
		data, _ := ioutil.ReadAll(resp.Body)
		w.WriteHeader(resp.StatusCode)
		w.Write([]byte(string(data)))
	}

}
