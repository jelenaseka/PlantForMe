import { Box,  Button,  Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { CollectionPlantContext } from "../../context/plantcare/CollectionPlantContext";
import CollectionPlantCard from "../../components/plantcare/CollectionPlantCard";
import EditIcon from '@mui/icons-material/Edit';
import EditCollectionPlantDialog from "../../components/plantcare/EditCollectionPlantDialog";
import { toast, ToastContainer } from "react-toastify";

const CollectionPlantPage = () => {
  const collectionPlantContext = useContext(CollectionPlantContext);
  const [editCollectionPlantDialogOpened,setEditCollectionPlantDialogOpened] = useState(false);

  const editCollectionPlant = (collectionPlant) => {
    collectionPlantContext.updateCollectionPlantHandler(collectionPlant).then(res => {
      if(res.ok) {
        toast.success("Successfully updated collection plant!");
        setEditCollectionPlantDialogOpened(false);
        collectionPlantContext.getCollectionPlantHandler();
      } else {
        toast.error(res.err);
      }
    })
  }

  return (
    <Box sx={{padding:'2em'}}>
      <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Typography variant="h1" component="div" gutterBottom sx={{fontSize:'30px', padding:'1em 0 '}}>
          Collection plant - {collectionPlantContext.collectionPlant.nickname}
        </Typography>
        <Button onClick={() => setEditCollectionPlantDialogOpened(true)}><EditIcon/></Button>
      </Box>
      
      <Grid item xs={12} sm={12} md={6} >
        <CollectionPlantCard plant={collectionPlantContext.collectionPlant} isEditable={false}/>
      </Grid>
      <EditCollectionPlantDialog
        collectionPlant={collectionPlantContext.collectionPlant} 
        open={editCollectionPlantDialogOpened} 
        handleCancel={() => {setEditCollectionPlantDialogOpened(false);console.log('canceled')}}
        handleSubmit={(collectionPlant) => editCollectionPlant(collectionPlant)}
      />
      <ToastContainer/>
    </Box>
  )
}

export default CollectionPlantPage;