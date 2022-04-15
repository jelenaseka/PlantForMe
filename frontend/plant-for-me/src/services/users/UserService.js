import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8086/api/users"

export const UserService = {
    getUsers: () => {
      return fetch(baseUrl, {headers: getHeaders()})
    },
    createUser: (user) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(user)
      })
    },
    updateUser: (user) => {
      return fetch(baseUrl + `/${user.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(user)
      })
    },
    deleteUser: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
    }
  }