package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func Me(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		principal := r.Context().Value(ContextClaimsKey{}).(Principal)

		principalJSON, err := json.Marshal(principal)

		client := &http.Client{
			Timeout: time.Second * 10,
		}

		req, _ := http.NewRequest(http.MethodGet, address+r.URL.String(), bytes.NewBuffer(principalJSON))

		res, err := client.Do(req)
		if err != nil {
			// log.Fatalln(err)
			return
		}
		defer res.Body.Close()

		data, _ := ioutil.ReadAll(res.Body)
		w.WriteHeader(res.StatusCode)
		w.Write([]byte(string(data)))
	}
}

func Get(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		res, err := http.Get(address + r.URL.String())
		if err != nil {
			fmt.Println("udje ovde")
			// log.Fatalln(err)
			return
		}
		defer res.Body.Close()

		data, _ := ioutil.ReadAll(res.Body)
		w.WriteHeader(res.StatusCode)
		w.Write([]byte(string(data)))
	}
}

func Post(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		data, _ := ioutil.ReadAll(r.Body)
		res, err := http.Post(address+r.URL.String(), "application/json", bytes.NewBuffer(data))
		if err != nil {
			// log.Fatalln(err)
			return
		}
		defer res.Body.Close()

		data, _ = ioutil.ReadAll(res.Body)
		w.WriteHeader(res.StatusCode)
		w.Write([]byte(string(data)))
	}
}

func Put(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		client := &http.Client{
			Timeout: time.Second * 10,
		}
		data, _ := ioutil.ReadAll(r.Body)

		req, err := http.NewRequest(http.MethodPut, address+r.URL.String(), bytes.NewBuffer(data))
		if err != nil {
			panic(err)
		}
		req.Header.Set("Content-Type", "application/json; charset=utf-8")

		res, err := client.Do(req)
		if err != nil {
			// log.Fatalln(err)
			return
		}
		defer res.Body.Close()

		data, _ = ioutil.ReadAll(res.Body)
		w.WriteHeader(res.StatusCode)
		w.Write([]byte(string(data)))
	}
}

func Delete(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		client := &http.Client{
			Timeout: time.Second * 10,
		}

		req, err := http.NewRequest(http.MethodDelete, address+r.URL.String(), nil)
		if err != nil {
			panic(err)
		}
		req.Header.Set("Content-Type", "application/json; charset=utf-8")

		res, err := client.Do(req)
		if err != nil {
			// log.Fatalln(err)
			return
		}
		defer res.Body.Close()

		data, _ := ioutil.ReadAll(res.Body)
		w.WriteHeader(res.StatusCode)
		w.Write([]byte(string(data)))
	}
}
