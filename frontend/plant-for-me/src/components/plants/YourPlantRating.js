import { Box, Button, FormControl, Paper, Rating, TextField } from "@mui/material";
import React, { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const YourPlantRating = ({userLeftReview}) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [editing, setEditing] = useState(false);

  
  const submitReview = () => {
    console.log(review, rating)
  }

  const isEditing = () => {

  }

  return (
    <Paper elevation={3} sx={{margin:'2em', padding:'2em'}}>
      <Box sx={{display:'flex', justifyContent:'space-between', marginBottom:'1em'}}>
        {
          (!userLeftReview || editing) &&
          <span>Leave a review</span>
        }
        {
          (userLeftReview && !editing) &&
          <span>Your review</span>
        }
        <Box sx={{display:'flex', alignItems:'center'}}>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            readOnly={!editing && userLeftReview}
          />
          {
            (userLeftReview && !editing) &&
            <Button onClick={() => setEditing(true)}>
              <EditIcon/>
            </Button>
          }
          {
            editing &&
            <Button onClick={() => setEditing(false)}>
              <CheckIcon/>
            </Button>
          }
          
        </Box>
        
      </Box>
      
      <FormControl fullWidth >
        <TextField
          id="standard-multiline-flexible"
          multiline
          maxRows={25}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          onBlur={() => setReview(review.trim())}
          variant="standard"
          InputProps={{
            readOnly: !editing && userLeftReview,
          }}
        />
      </FormControl>
      {
        !userLeftReview &&
        <Box sx={{display:'flex', flexDirection:'row', justifyContent: 'end', marginTop:'1em'}}>
        <Button variant="contained" onClick={() => submitReview()}>Submit</Button>
        </Box>
      }
      
      
    </Paper>
  )
}

export default YourPlantRating;