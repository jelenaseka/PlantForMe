import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/forum/categories"

export const ForumCategoryService = {
  getCategoriesCountPosts: () => {
    var fullUrl = baseUrl + "/count/posts";
    return fetch(fullUrl, {headers: getHeaders()})
  },
}