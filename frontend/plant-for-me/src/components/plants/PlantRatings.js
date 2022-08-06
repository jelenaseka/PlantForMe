import { Avatar, Button, Chip, Divider, FormControl, Paper, Rating, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlantContext } from '../../context/plants/PlantContext';
import YourPlantRating from "./YourPlantRating";

const PlantRatings = () => {
  const plantContext = useContext(PlantContext);
  const [userLeftReview, setUserLeftReview] = useState(true);
  const [userReview, setUserReview] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    getUserReview();
    getAverageRating();
    getAllReviews();
  }, [])

  const refresh = () => {
    getUserReview();
    getAverageRating();
    getAllReviews();
  }

  const getAllReviews = () => {
    plantContext.getAllReviewsHandler().then(res => {
      if(res.ok) {
        setReviews(res.data);
      }
    })
  }

  const getUserReview = () => {
    
    plantContext.getUserReviewHandler().then(res => {
      if(res.ok) {
        if(res.code === 200) {
          setUserReview(res.data);
          setUserLeftReview(true);
        } else if(res.code === 204) {
          setUserLeftReview(false);
        }
      }
    })
  }

  const getAverageRating = () => {
    plantContext.getAverageRatingHandler().then(res => {
      if(res.ok) {
        setAverageRating(res.data);
      }
    })
  }
  
  return (
    <div>
      {
        plantContext.currentUser ?
        <YourPlantRating userLeftReview={userLeftReview} refresh={refresh} userReview={userReview}/>
        : <Box sx={{paddingLeft:'2em'}}><Link to="/login">Log in</Link> to leave a review</Box>
      }
      <Box sx={{padding:'2em', display:'flex', alignItems:'center'}}>
        <p>Average rating:</p>
        <Rating readOnly sx={{marginLeft:'0.5em'}}
              name="simple-controlled"
              value={averageRating}
            />
        <Chip sx={{marginLeft:'0.5em'}} label={averageRating} />
          
      </Box>
      <Box sx={{padding:'0 2em 2em'}}>
        {
          reviews.map((review, index) => (
            <div key={index}>
              <Box sx={{display:'flex', alignItems:'center'}}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }}/>
                <Box sx={{marginLeft:'0.6em'}}>
                  <Typography variant="subtitle2" gutterBottom sx={{fontWeight:'bold'}}>
                    {review.username}
                  </Typography>
                  <Rating readOnly 
                    name="simple-controlled"
                    value={review.rating}
                  />
                  <Typography variant="body1" gutterBottom component="div">
                    {review.comment}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{margin:'0.8em'}}/>
            </div>
          ))
        }
      </Box>
    </div>
  )
}

export default PlantRatings;