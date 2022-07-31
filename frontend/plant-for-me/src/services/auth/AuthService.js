import getHeaders from "./auth-header";

const baseUrl = "http://localhost:8080/api/auth"

export const AuthService = {
  login: (userCredentials) => {
    return fetch(baseUrl + "/login", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userCredentials)
    })
  },
  logout() {
    localStorage.removeItem("user");
  },
  register: (newUser) => {
    return fetch(baseUrl + "/register", {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(newUser)
    })
  },
  getMe: () => {
    return fetch(baseUrl + "/me", {headers: getHeaders()})
  },
  changeUsername: (user) => {
    return fetch(baseUrl + "/username", {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user)
    })
  },
  changePassword: (user) => {
    return fetch(baseUrl + "/password", {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user)
    })
  },
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}