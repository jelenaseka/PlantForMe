const baseUrl = "http://localhost:8086/api/auth"

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
  getCurrentUser() {
    return localStorage.getItem('user');
  }
}