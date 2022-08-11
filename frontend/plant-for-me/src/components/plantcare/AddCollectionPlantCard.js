import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useContext, useState } from "react";
import AddCollectionPlantDialog from "./AddCollectionPlantDialog";
import AddIcon from '@mui/icons-material/Add';
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import { toast } from "react-toastify";

const AddCollectionPlantCard = () => {
  const collectionContext = useContext(CollectionContext);
  const [addCollectionPlantDialogOpened, setAddCollectionPlantDialogOpened] = useState(false);

  const addCollectionPlant = (collectionPlant) => {
    collectionContext.addCollectionPlantHandler(collectionPlant)
      .then(res => {
        if(res.ok) {
          toast.success("Successfully created new collection plant!");
          collectionContext.getCollectionPlantsHandler()
        } else {
          toast.error(res.err)
        }
      })
    setAddCollectionPlantDialogOpened(false);
  }
  return (
    <div>
      <Card sx={{bgcolor: grey[100]}}>
        <CardMedia
          sx={{height:'140px', display:'flex', justifyContent:'center', alignItems:'center'}}
        >
          <Button sx={{color:grey[700]}} onClick={() => setAddCollectionPlantDialogOpened(true)}>
            <AddIcon/>
          </Button>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add plant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add plant to your collection so you can track its condition and add tasks to it
          </Typography>
        </CardContent>
      </Card>
      <AddCollectionPlantDialog 
        open={addCollectionPlantDialogOpened} 
        handleCancel={() => {setAddCollectionPlantDialogOpened(false);console.log('canceled')}}
        handleSubmit={(collectionPlant) => addCollectionPlant(collectionPlant)}
      />
      
    </div>
  )
}

export default AddCollectionPlantCard;