import React, { useContext } from 'react';
import { Box } from "@mui/system"
import { Grid, Typography } from "@mui/material"
import '../../assets/css/layout.css';
import { PlantContext } from '../../context/plants/PlantContext';
import { ToastContainer } from 'react-toastify';
import PlantRatings from '../../components/plants/PlantRatings';
import PlantFeatures from '../../components/plants/PlantFeatures';

const PlantPage = () => {
  const plantContext = useContext(PlantContext);

  return (
    <div>
      {
      plantContext.plant &&
      <Box>
        <Grid container >
          <Grid item md={4} sm={12} xs={12} sx={{padding:'2em'}}>
            <PlantFeatures/>
          </Grid>
          <Grid item md={8} sm={12} sx={{padding:'2em'}}>
            <h1 className='plant-name-font'>{plantContext.plant.name}</h1>
            <div className="placeholder-one-plant">
              <img  src={plantContext.plant.image} alt="Your plant"/>
            </div>
          </Grid>
        </Grid>
        <Box sx={{padding:'2em'}}>
          <Typography variant="h5" gutterBottom component="div" sx={{marginBottom:'1em'}}>
            Plant description
          </Typography>
          {plantContext.plant.description}
        </Box>
        <PlantRatings/>
      </Box>
      }
      <ToastContainer />
    </div>
  )
}

export default PlantPage