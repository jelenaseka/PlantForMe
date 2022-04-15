package handlers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func MiddlewareAuthorization(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("Middleware Authorization called")

		client := &http.Client{
			Timeout: time.Second * 10,
		}
		req, _ := http.NewRequest(http.MethodGet, "http://localhost:8086/api/auth/authorized", nil)
		if r.Header["Authorization"] != nil {
			req.Header.Add("Authorization", r.Header["Authorization"][0])
		}

		req.Header.Add("Requested-Api", r.URL.String())
		req.Header.Add("Requested-Method", r.Method)

		resp, err := client.Do(req)
		if err != nil {
			log.Fatalln(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == 200 {
			log.Println("200 ok")
			next.ServeHTTP(w, r)
			return
		}

		data, _ := ioutil.ReadAll(resp.Body)
		w.WriteHeader(resp.StatusCode)
		json.NewEncoder(w).Encode(string(data))

	})
}
