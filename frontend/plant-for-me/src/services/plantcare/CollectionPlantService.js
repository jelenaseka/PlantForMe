import getHeaders from "../auth/auth-header"

const baseUrl = "http://localhost:8080/api/collectionplants"

export const CollectionPlantService = {
    getAllByCollectionId: (id) => {
      return fetch(baseUrl + `/collection/${id}`, {headers: getHeaders()})
    },
    getOne: (plantid) => {
      return fetch(`${baseUrl}/${plantid}`, {headers:getHeaders()})
    },
    createCollectionPlant: (collectionPlant) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(collectionPlant)
      })
    },
    updateCollectionPlant: (collectionPlant, id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(collectionPlant)
      })
    },
    deleteCollectionPlant: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE', 
        headers: getHeaders()
      })
    }
  }