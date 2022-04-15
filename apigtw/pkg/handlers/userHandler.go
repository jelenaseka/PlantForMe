package handlers

import (
	"io/ioutil"
	"log"
	"net/http"
)

type UserHandler struct {
	l *log.Logger
}

func NewUserHandler(l *log.Logger) *UserHandler {
	return &UserHandler{l}
}

func (this *UserHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	this.l.Print("Get all users")
	w.Header().Add("Content-Type", "application/json")

	res, err := http.Get("http://localhost:8086" + r.URL.String())
	if err != nil {
		log.Fatalln(err)
	}
	defer res.Body.Close()

	data, _ := ioutil.ReadAll(res.Body)
	this.l.Print(string(data))
	w.WriteHeader(res.StatusCode)
	w.Write([]byte(string(data)))
}

func (this *UserHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	// vars := mux.Vars(r)
	// id := vars["id"]

	// if !validation_utils.IsValidUUID(id) {
	// 	http.Error(w, "Bad request. Id format error", http.StatusBadRequest)
	// 	return
	// }

	// this.l.Println("Get user with the id ", id)

	// w.Header().Add("Content-Type", "application/json")

	// userResponse, err := this.IUserService.GetOneById(uuid.Must(uuid.Parse(id)))
	// if err != nil {
	// 	http.Error(w, err.Message(), err.Status())
	// 	return
	// }
	// json.NewEncoder(w).Encode(userResponse)
}
