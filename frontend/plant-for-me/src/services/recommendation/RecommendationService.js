import getHeaders from "../auth/auth-header";

const baseUrl = "http://localhost:8080/api/recommendation"

export const RecommendationService = {
  getRecommendations: () => {
    return fetch(baseUrl, {headers: getHeaders()})
  },
}