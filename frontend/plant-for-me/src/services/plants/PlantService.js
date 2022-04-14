const baseUrl = "http://localhost:8085/api/plants"

export const PlantService = {
    getPlants: async (url) => {
      if(url === undefined) {
        url = ""
      }
      var fullUrl = baseUrl + "?" + url;
      console.log(fullUrl)
      const response = await fetch(fullUrl)
      const data = await response.json()
      return data
    },
    getOne: async (id) => {
      return fetch(baseUrl + `/${id}`)
    },
    createPlant: (plant) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(plant)
      })
    },
    updatePlant: async (plant) => {
      return fetch(baseUrl + `/${plant.id}`, {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(plant)
      })
    },
    deletePlant: async (id) => {
      await fetch(baseUrl + `/${id}`, {
        method: 'DELETE'
      })
    }
  }