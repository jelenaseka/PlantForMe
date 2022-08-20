import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/plants"

export const PlantService = {
    getPlants: (url) => {
      if(url === undefined) {
        url = ""
      }
      var fullUrl = baseUrl + "?" + url;
      return fetch(fullUrl, {headers: getHeaders()})
    },
    getOneWithCategory: async (id) => {
      return fetch(baseUrl + `/${id}/cat`, {headers: getHeaders()})
    },
    getOne: async (id) => {
      return fetch(baseUrl + `/${id}`, {headers: getHeaders()})
    },
    createPlant: (plant) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(plant)
      })
    },
    updatePlant: (plant) => {
      return fetch(baseUrl + `/${plant.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(plant)
      })
    },
    deletePlant: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE', 
        headers: getHeaders()
      })
    }
  }