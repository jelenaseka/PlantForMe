import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import AddCollectionDialog from "./AddCollectionDialog";
import { grey } from "@mui/material/colors";

const AddCollectionCard = () => {
  const [addCollectionDialogOpened, setAddCollectionDialogOpened] = useState(false);

  const addCollection = (collection) => {
    console.log(collection);
    setAddCollectionDialogOpened(false);
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