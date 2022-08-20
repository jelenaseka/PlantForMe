import { Box, Button, FormControl, Paper, Rating, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { PlantContext } from "../../context/plants/PlantContext";
import { toast } from 'react-toastify';
import { red } from "@mui/material/colors";

const YourPlantRating = ({userLeftReview, refresh, userReview}) => {
  const plantContext = useContext(PlantContext);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setReview(userReview.comment);
    if (userReview.rating) {
      setRating(userReview.rating);
    }
  }, [userReview])
  
  const submitReview = () => {
    plantContext.submitReviewHandler(review, rating).then(res => {
      if(res.ok) {
        toast.success("Successfully submitted review!")
        refresh();
      }
    })
  }

  const deleteReview = () => {
    plantContext.deleteReviewHandler(userReview.id).then(res => {
      if(res.ok) {
        setRating(0);
        setReview("");
        toast.success("Successfully deleted review!")
        refresh();
      }
    })
  }

  const updateReview = () => {
    setEditing(false);
    plantContext.updateReviewHandler(review, rating, userReview.id).then(res=> {
      if(res.ok) {
        toast.success("Successfully edited review!")
        refresh();
      }
    })
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
            <div>
              <Button onClick={() => setEditing(true)}>
                <EditIcon/>
              </Button>
              <Button sx={{color: red[700]}}>
                <DeleteIcon onClick={() => deleteReview(true)}/>
              </Button>
            </div>
            
          }
          {
            editing &&
            <Button onClick={updateReview}>
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