import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import AddCollectionDialog from "./AddCollectionDialog";
import { grey } from "@mui/material/colors";
import { PlantCareContext } from "../../context/plantcare/PlantCareContext";
import { toast } from "react-toastify";

const AddCollectionCard = () => {
  const plantCareContext = useContext(PlantCareContext);
  const [addCollectionDialogOpened, setAddCollectionDialogOpened] = useState(false);

  const addCollection = (collection) => {
    plantCareContext.addCollectionHandler(collection)
      .then(res => {
        if(res.ok) {
          toast.success("Successfully added new collection!");
          setAddCollectionDialogOpened(false);
        } else {
          toast.error(res.err)
        }
      })
  }

  return (
    <div>
      <Card sx={{bgcolor: grey[100]}}>
        <CardMedia
          sx={{height:'140px', display:'flex', justifyContent:'center', alignItems:'center'}}
        >
          <Button sx={{color:grey[700]}} onClick={() => setAddCollectionDialogOpened(true)}>
            <AddIcon/>
          </Button>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add collection
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Collection represents a group of plants you find similar or want to have grouped together
          </Typography>
        </CardContent>
      </Card>
      <AddCollectionDialog 
        open={addCollectionDialogOpened} 
        handleCancel={() => {setAddCollectionDialogOpened(false);console.log('canceled')}}
        handleSubmit={(collection) => addCollection(collection)}
      />
      
    </div>
    
  )
}

export default AddCollectionCard;