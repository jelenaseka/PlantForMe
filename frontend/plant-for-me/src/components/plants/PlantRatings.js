import { Avatar, Button, Divider, FormControl, Paper, Rating, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { PlantContext } from '../../context/plants/PlantContext';
import YourPlantRating from "./YourPlantRating";

const PlantRatings = () => {
  const plantContext = useContext(PlantContext);
  const [userLeftReview, setUserLeftReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // plantContext.getUserLeftReview().then(res => {

    // })

    // plantContext.getAverageRating().then(res => {

    // })
  }, [])
  
  return (
    <div>
      {
        // plantContext.currentUser && userLeftReview
        <YourPlantRating userLeftReview={userLeftReview}/>
      }
      <Box sx={{padding:'2em', display:'flex', alignItems:'center'}}>
        <p>Average rating:</p>
        <Rating readOnly sx={{marginLeft:'0.5em'}}
              name="simple-controlled"
              value={averageRating}
            />
      </Box>
      <Box sx={{padding:'0 2em 2em'}}>
        {/* <!--foreach--> */}
        <Box sx={{display:'flex', alignItems:'center'}}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }}/>
          <Box sx={{marginLeft:'0.6em'}}>
            <Typography variant="subtitle2" gutterBottom sx={{fontWeight:'bold'}}>
              Barbara
            </Typography>
            <Rating readOnly 
              name="simple-controlled"
              value={2}
            />
            <Typography variant="body1" gutterBottom component="div">
              body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, 
            </Typography>
          </Box>
        </Box>
        <Divider sx={{margin:'0.8em'}}/>
        <Box sx={{display:'flex', alignItems:'center'}}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }}/>
          <Box sx={{marginLeft:'0.6em'}}>
            <Typography variant="subtitle2" gutterBottom sx={{fontWeight:'bold'}}>
              Barbara
            </Typography>
            <Rating
              name="simple-controlled"
              value={2}
            />
            <Typography variant="body1" gutterBottom component="div">
              body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, 
            </Typography>
          </Box>
        </Box>
        <Divider sx={{margin:'0.8em'}}/>
        <Box sx={{display:'flex', alignItems:'center'}}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }}/>
          <Box sx={{marginLeft:'0.6em'}}>
            <Typography variant="subtitle2" gutterBottom sx={{fontWeight:'bold'}}>
              Barbara
            </Typography>
            <Rating
              name="simple-controlled"
              value={2}
            />
            <Typography variant="body1" gutterBottom component="div">
              body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, 
            </Typography>
          </Box>
        </Box>
        <Divider sx={{margin:'0.8em'}}/>
      </Box>
    </div>
  )
}

export default PlantRatings;