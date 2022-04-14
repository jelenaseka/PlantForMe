const baseUrl = "http://localhost:8086/api/users"

export const UserService = {
    getUsers: async () => {
      const response = await fetch(baseUrl)
      const data = await response.json()
      return data
    },
    createUser: (user) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
      })
    },
    updateUser: (user) => {
      return fetch(baseUrl + `/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(user)
      })
    },
    deleteUser: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE'
      })
    }
  }