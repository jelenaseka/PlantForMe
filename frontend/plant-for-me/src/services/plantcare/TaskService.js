import getHeaders from "../auth/auth-header"

const baseUrl = "http://localhost:8080/api/tasks"

export const TaskService = {
    getAllByCollectionPlantId: (id) => {
      return fetch(baseUrl + `/collectionplant/${id}`, {headers: getHeaders()})
    },
    createTask: (task) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task)
      })
    },
    setTaskToDone: (id) => {
      return fetch(baseUrl + `/${id}/done`, {
        method: 'PUT',
        headers: getHeaders()
      })
    },
    deleteTask: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE', 
        headers: getHeaders()
      })
    }
  }