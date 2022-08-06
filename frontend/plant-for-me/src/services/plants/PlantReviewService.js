import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/plantreviews"

export const PlantReviewService = {
  getAllByPlant: async (id) => {
    return fetch(baseUrl + `/plant/${id}`, {headers: getHeaders()})
  },
  getUserReview: async (id) => {
    return fetch(baseUrl + `/plant/${id}/mine`, {headers: getHeaders()})
  },
  getAverageRating: async (id) => {
    return fetch(baseUrl + `/plant/${id}/rating`, {headers: getHeaders()})
  },
  submitReview: (plantReview) => {
    return fetch(baseUrl, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(plantReview)
    })
  },
  updateReview: (plantReview, id) => {
    return fetch(baseUrl + `/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(plantReview)
    })
  },
}