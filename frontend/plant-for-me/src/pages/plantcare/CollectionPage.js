import React, { useContext, useEffect } from "react";
import { CollectionContext } from "../../context/plantcare/CollectionContext";

import { Box, Grid, Typography } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import CollectionPlantCard from "../../components/plantcare/CollectionPlantCard";
import AddCollectionPlantDialog from "../../components/plantcare/AddCollectionPlantDialog";
import AddCollectionPlantCard from "../../components/plantcare/AddCollectionPlantCard";

const CollectionPage = () => {
  const collectionContext = useContext(CollectionContext);


  useEffect(() => {
  }, [collectionContext.collection])

  return (
    <Box>
      <Typography variant="h1" component="div" gutterBottom sx={{fontSize:'30px', padding:'2em 2em 0 2em'}}>
        Collection - {collectionContext.collection.name}
      </Typography>
      {
        collectionContext.collectionPlants &&
        <Grid sx={{padding:'2em'}} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {collectionContext.collectionPlants.map((plant, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <CollectionPlantCard plant={plant} isEditable={true}/>
            </Grid>
          ))}
          <Grid item xs={2} sm={4} md={4}>
            <AddCollectionPlantCard/>
          </Grid>
        </Grid>
      }
      
      <ToastContainer/>
    </Box>
      
  )
}

export default CollectionPage;