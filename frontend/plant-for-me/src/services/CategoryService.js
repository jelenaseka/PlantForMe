const baseUrl = "http://localhost:8085/api/categories"

export const CategoryService = {
    getCategories: async () => {
      const response = await fetch(baseUrl)
      const data = await response.json()
      console.log(data)
      return data
    },
    createCategory: async (category) => {
      
    },
    updateCategory: async (category) => {
      
    },
    deleteCategory: async (category) => {
      
    }
  }