package handlers

import (
	"api-gateway/pkg/data"
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type Principal struct {
	Username string
	Role     data.Role
}

type ContextClaimsKey struct{}

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
			log.Println("FATAL err")
			log.Fatalln(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == 200 {
			log.Println("200 ok")

			data, _ := ioutil.ReadAll(resp.Body)

			var principal Principal

			json.Unmarshal([]byte(string(data)), &principal)

			ctx := context.WithValue(r.Context(), ContextClaimsKey{}, principal)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
			return
		}
		log.Println("nije ok")

		data, _ := ioutil.ReadAll(resp.Body)
		log.Println(string(data))
		log.Println(resp.StatusCode)
		w.WriteHeader(resp.StatusCode)
		w.Write([]byte(string(data)))

	})
}
