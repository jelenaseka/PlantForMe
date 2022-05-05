import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/forum/categories"

export const ForumCategoryService = {
  getCategoriesCountPosts: () => {
    var fullUrl = baseUrl + "/count/posts";
    return fetch(fullUrl, {headers: getHeaders()})
  },
  createCategory: (category) => {
    return fetch(baseUrl, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(category)
    })
  },
  deleteCategory: (id) => {
    return fetch(baseUrl + `/${id}`, {
      method: 'DELETE', 
      headers: getHeaders()
    })
  },

  updateCategory: (category, id) => {
    return fetch(baseUrl + `/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(category)
    })
  }
}