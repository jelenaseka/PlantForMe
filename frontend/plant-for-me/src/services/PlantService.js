const baseUrl = "http://localhost:8085/api/plants"

export const PlantService = {
    getPlants: async (url) => {
      if(url == undefined) {
        url = ""
      }
      var fullUrl = baseUrl + "?" + url;
      console.log(fullUrl)
      const response = await fetch(fullUrl)
      const data = await response.json()
      console.log(data)
      return data
    },
    getOne: async (id) => {
      const response = await fetch(baseUrl + `/${id}`)
      const data = await response.json()
      return data
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
      
    },
    deletePlant: async (id) => {
      
    }
  }