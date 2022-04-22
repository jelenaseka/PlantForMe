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
      console.log('evo',params.toString())
      var fullUrl = baseUrl + "?" + params.toString();
      return fetch(fullUrl, {headers: getHeaders()})
    },

    getPostsCount: (category) => {
      var fullUrl = baseUrl + "/all/count";
      if (category !== undefined && category !== null) {
        fullUrl += "?category=" + category;
      }
      return fetch(fullUrl, {headers: getHeaders()})
    }
  }