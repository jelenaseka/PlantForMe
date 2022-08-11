import getHeaders from "../auth/auth-header"

const baseUrl = "http://localhost:8080/api/collections"

export const CollectionService = {
    getMyCollections: () => {
      return fetch(baseUrl + "/mine", {headers: getHeaders()})
    },
    getCollection: (id) => {
      return fetch(`${baseUrl}/${id}`, {headers:getHeaders()})
    },
    createCollection: (collection) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(collection)
      })
    },
    updateCollection: (collection, id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(collection)
      })
    },
    deleteCollection: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE', 
        headers: getHeaders()
      })
    }
  }