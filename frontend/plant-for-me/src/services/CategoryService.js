const baseUrl = "http://localhost:8085/api/categories"

export const CategoryService = {
    getCategories: async () => {
      const response = await fetch(baseUrl)
      const data = await response.json()
      console.log(data)
      return data
    },
    createCategory: async (category) => {
      await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(category)
      })
    },
    updateCategory: async (category) => {
      await fetch(baseUrl + `/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(category)
      })
    },
    deleteCategory: async (id) => {
      await fetch(baseUrl + `/${id}`, {
        method: 'DELETE'
      })
    }
  }