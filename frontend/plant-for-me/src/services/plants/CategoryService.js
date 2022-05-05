import getHeaders from "../auth/auth-header"

const baseUrl = "http://localhost:8080/api/categories"

export const CategoryService = {
    getCategories: () => {
      return fetch(baseUrl, {headers: getHeaders()})
    },
    createCategory: (category) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(category)
      })
    },
    updateCategory: (category) => {
      return fetch(baseUrl + `/${category.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(category)
      })
    },
    deleteCategory: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE', 
        headers: getHeaders()
      })
    }
  }