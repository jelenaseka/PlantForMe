const baseUrl = "http://localhost:8085/api/plants"

export const PlantService = {
    getPlants: async () => {
      const response = await fetch(baseUrl)
      const data = await response.json()
      console.log(data)
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