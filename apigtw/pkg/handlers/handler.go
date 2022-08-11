package handlers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func Me(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		principal := r.Context().Value(ContextClaimsKey{}).(Principal)

		// principalJSON, err := json.Marshal(principal)

		client := &http.Client{
			Timeout: time.Second * 10,
		}

		req, _ := http.NewRequest(http.MethodGet, address+r.URL.String(), nil)
		req.Header.Add("Username", principal.Username)
		req.Header.Add("Role", principal.Role.String())

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
		log.Println("GET")
		principal := r.Context().Value(ContextClaimsKey{}).(Principal)

		client := &http.Client{
			Timeout: time.Second * 10,
		}

		req, _ := http.NewRequest(http.MethodGet, address+r.URL.String(), nil)
		req.Header.Add("Username", principal.Username)
		req.Header.Add("Role", principal.Role.String())

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

func Post(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		log.Println("POST")

		client := &http.Client{
			Timeout: time.Second * 10,
		}

		data, _ := ioutil.ReadAll(r.Body)

		principal := r.Context().Value(ContextClaimsKey{}).(Principal)
		req, _ := http.NewRequest(http.MethodPost, address+r.URL.String(), bytes.NewBuffer(data))
		req.Header.Add("Username", principal.Username)
		req.Header.Add("Role", principal.Role.String())

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

func Put(address string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		log.Println("PUT")

		client := &http.Client{
			Timeout: time.Second * 10,
		}
		data, _ := ioutil.ReadAll(r.Body)
		log.Print("data ovde:", bytes.NewBuffer(data))

		req, err := http.NewRequest(http.MethodPut, address+r.URL.String(), bytes.NewBuffer(data))

		principal := r.Context().Value(ContextClaimsKey{}).(Principal)
		req.Header.Add("Username", principal.Username)
		req.Header.Add("Role", principal.Role.String())

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
		log.Println("DELETE")

		principal := r.Context().Value(ContextClaimsKey{}).(Principal)

		principalJSON, err := json.Marshal(principal)

		client := &http.Client{
			Timeout: time.Second * 10,
		}

		req, err := http.NewRequest(http.MethodDelete, address+r.URL.String(), bytes.NewBuffer(principalJSON))
		if err != nil {
			panic(err)
		}
		req.Header.Set("Content-Type", "application/json; charset=utf-8")
		req.Header.Add("Username", principal.Username)
		req.Header.Add("Role", principal.Role.String())

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
