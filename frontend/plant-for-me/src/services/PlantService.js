const baseUrl = "http://localhost:8085/api/plants"

export const PlantService = {
    getPlants: async () => {
      const response = await fetch(baseUrl)
      const data = await response.json()
      return data
    },
    getOne: async (id) => {
      const response = await fetch(baseUrl + `/${id}`)
      const data = await response.json()
      return data
    },
    createPlant: async (plant) => {
      await fetch(baseUrl, {
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