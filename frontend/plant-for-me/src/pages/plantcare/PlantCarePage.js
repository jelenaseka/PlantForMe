import React, { useContext,  } from "react";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { PlantCareContext } from "../../context/plantcare/PlantCareContext";
import CollectionCard from "../../components/plantcare/CollectionCard";
import AddCollectionCard from "../../components/plantcare/AddCollectionCard";
import { ToastContainer } from 'react-toastify';

const PlantCarePage = () => {
  const plantCareContext = useContext(PlantCareContext);
  
  return (
    <Box>
      <Typography variant="h1" component="div" gutterBottom sx={{fontSize:'30px', padding:'2em 2em 0 2em'}}>
        My collections
      </Typography>
      <Grid sx={{padding:'2em'}} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {plantCareContext.collections.map((collection, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <CollectionCard collection={collection}/>
          </Grid>
        ))}
        <Grid item xs={2} sm={4} md={4}>
          <AddCollectionCard/>
        </Grid>
      </Grid>
      <ToastContainer/>
    </Box>
  )
}

export default PlantCarePage;