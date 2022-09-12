import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { RecommendationContext } from "../../context/recommendation/RecommendationContext";
import RecommendationPage from "../../pages/recommendation/RecommendationPage";
import { AuthService } from "../../services/auth/AuthService";
import { RecommendationService } from "../../services/recommendation/RecommendationService";
import { tokenIsExpired } from "../../utils/functions/jwt";

const RecommendationContainer = () => {
  const [recommendations, setRecommendations] = useState([])
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if(tokenIsExpired()) {
      AuthService.logout();
    }
    if(currentUser !== null) {
      getRecommendationsHandler()
    }
  }, [])

  const getRecommendationsHandler = () => {
    const getData = RecommendationService.getRecommendations()
      .then(async res => {
        if(res.ok) {
          return res.json().then(data => setRecommendations(data))
        }
      })
    return getData;
  }

  return (
    <RecommendationContext.Provider value={{recommendations, currentUser}}>
      <RecommendationPage/>
    </RecommendationContext.Provider>
  )
}

export default RecommendationContainer;