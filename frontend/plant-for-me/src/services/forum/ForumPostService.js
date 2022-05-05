import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/posts"

export const ForumPostService = {
    getMostPopularPostsCountComments: () => {
      var fullUrl = baseUrl + "/count/comments";
      return fetch(fullUrl, {headers: getHeaders()})
    },

    getLatestPostsCountComments: () => {
      var fullUrl = baseUrl + "?orderBy=createdAt";
      return fetch(fullUrl, {headers: getHeaders()})
    },

    getAllPostsCountComments: (page, category) => {
      const params = new URLSearchParams()
      if (page !== null && !isNaN(page)) {
        params.append("page", page)
      } else {
        params.append("page", 1)
      }
      if (category !== undefined && category !== null) {
        params.append("category", category)
      }
      var fullUrl = baseUrl + "?" + params.toString();
      return fetch(fullUrl, {headers: getHeaders()})
    },

    getPostsCount: (category) => {
      var fullUrl = baseUrl + "/all/count";
      if (category !== undefined && category !== null) {
        fullUrl += "?category=" + category;
      }
      return fetch(fullUrl, {headers: getHeaders()})
    },

    getOne: (id) => {
      return fetch(`${baseUrl}/${id}`, {headers: getHeaders()})
    },

    createPost: (post) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(post)
      })
    },

    deletePost: (id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'DELETE', 
        headers: getHeaders()
      })
    },

    updatePost: (post, id) => {
      return fetch(baseUrl + `/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(post)
      })
    }
  }