import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/comments"

export const CommentsService = {
    getCommentsCountByPostId: (postId) => {
      
      const fullUrl = `${baseUrl}/${postId}/count`
      return fetch(fullUrl, {headers: getHeaders()})
    },
    getCommentsByPostId: (postId, page) => {
      if (page === undefined || page === null) {
        page = 1;
      }
      const fullUrl = `${baseUrl}/post/${postId}?page=${page}`
      return fetch(fullUrl, {headers: getHeaders()})
    },
    submitComment: (comment) => {
      return fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(comment)
      })
    }
  }