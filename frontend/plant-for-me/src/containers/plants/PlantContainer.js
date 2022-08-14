import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { PlantContext} from '../../context/plants/PlantContext'
import PlantPage from "../../pages/plants/PlantPage";
import { PlantService } from "../../services/plants/PlantService";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth/AuthService";
import { PlantReviewService } from "../../services/plants/PlantReviewService";
import { tokenIsExpired } from "../../utils/functions/jwt";

const PlantContainer = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null)
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if(tokenIsExpired()) {
      AuthService.logout();
    }
    getPlantHandler();
  }, [id])

  const getPlantHandler = () => {
    const getData = PlantService.getOne(id)
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setPlant(data));
        } else {
          if(res.status === 204) {
            return navigate("/404");
          }
        }
      })
      .catch(err => console.log(err))
    return getData;
  }

  const deletePlantHandler = () => {
    const deletePlant = PlantService.deletePlant(id)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      });
    return deletePlant;
  }

  const getUserReviewHandler = () => {
    const getUserReview = PlantReviewService.getUserReview(id)
      .then(async res => {
        if(res.ok) {
          if(res.status === 200) {
            const data = await res.json();
            return { ok: true, data: data, code: res.status};
          } else if(res.status === 204) {
            return { ok: true, code: res.status};
          }
          
        } else {
          const data = await res.text();
          return { ok: false, err: data};
        }
      })
      .catch(err => console.log(err));
    return getUserReview;
  }

  const getAverageRatingHandler = () => {
    const getAverageRating = PlantReviewService.getAverageRating(id)
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          return { ok: true, data: data, code: res.status};
        } else {
          const data = await res.text();
          return { ok: false, err: data, code: res.status};
        }
      })
      .catch(err => console.log(err));
    return getAverageRating;
  }

  const getAllReviewsHandler = () => {
    const getAllReviews = PlantReviewService.getAllByPlant(id)
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          return { ok: true, data: data};
        } else {
          const data = await res.text();
          return { ok: false, err: data, code: res.status};
        }
      })
      .catch(err => console.log(err));
    return getAllReviews;
  }

  const submitReviewHandler = (review, rating) => {
    const submitReview = PlantReviewService.submitReview({comment: review, rating: rating, plantID: id})
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          return { ok: true, data: data};
        } else {
          const data = await res.text();
          return { ok: false, err: data, code: res.status};
        }
      })
      .catch(err => console.log(err));
    return submitReview;
  }

  const updateReviewHandler = (review, rating, reviewID) => {
    const updateReview = PlantReviewService.updateReview({comment:review, rating:rating}, reviewID)
      .then(async res => {
        if(res.ok) {
          return { ok: true }
        } else {
          const data = await res.text();
          return { ok: false, err: data};
        }
      })
      .catch(err => console.log(err));
    return updateReview;
  }

  const deleteReviewHandler = (reviewID) => {
    const deleteReview = PlantReviewService.deleteReview(reviewID)
      .then(async res => {
        if(res.ok) {
          return { ok: true };
        } else {
          const data = await res.text();
          return { ok: false, err: data};
        }
      }).catch(err => console.log(err));
    return deleteReview;
  }

  return (
    <PlantContext.Provider value={{
      plant, 
      deletePlantHandler, 
      currentUser, 
      getUserReviewHandler, 
      getAverageRatingHandler, 
      getAllReviewsHandler,
      submitReviewHandler,
      updateReviewHandler,
      deleteReviewHandler}}>
      <PlantPage/>
    </PlantContext.Provider>
  )
}

export default PlantContainer;