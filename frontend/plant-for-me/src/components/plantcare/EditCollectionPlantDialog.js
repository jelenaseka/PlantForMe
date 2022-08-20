import { Box, Button, Dialog, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { handleFileUpload } from "../../utils/functions/imageHandler";

const EditCollectionPlantDialog = ({open, handleCancel, handleSubmit, collectionPlant}) => {
  const [newCollectionPlant, setNewCollectionPlant] = useState({
    base64Image: collectionPlant.base64Image,
    nickname: collectionPlant.nickname
  });

  useEffect(() => {
    setNewCollectionPlant({
      base64Image: collectionPlant.base64Image,
      nickname: collectionPlant.nickname
    })
  }, [collectionPlant])

  const submit = () => {
    handleSubmit(newCollectionPlant);
  }

  const fileUpload = (e) => {
    handleFileUpload(e, (base64) => setNewCollectionPlant({...newCollectionPlant, base64Image: base64}));
  }

  return (
    <Dialog
        open={open}
        onClose={handleCancel}
      >
        <Box sx={{padding: '2em'}}>
          <TextField
            sx={{marginBottom:'1em'}}
            autoFocus
            margin="dense"
            label="Plant nickname"
            type="text"
            fullWidth
            value={newCollectionPlant.nickname}
            onChange={(e) => setNewCollectionPlant({...newCollectionPlant, nickname: e.target.value})}
            onBlur={() => setNewCollectionPlant({...newCollectionPlant, nickname: newCollectionPlant.nickname.trim()})} 
            variant="standard"
          />
          <Button
            variant="contained"
            sx={{color:"white"}}
            component="label"
          >
            Upload image
            <input type="file" onChange={(e) => fileUpload(e)} hidden/>
          </Button>
          <Button onClick={() => setNewCollectionPlant({...newCollectionPlant, base64Image: null})}>
            Remove image
          </Button>
          <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <div className="image-placeholder">
              <img src={newCollectionPlant.base64Image} alt="collection plant"/>
            </div>
          </Box>
          <Button variant="contained" sx={{color: "white"}} onClick={() => submit()}>submit</Button>
        </Box>
          
      </Dialog>
  )
}

export default EditCollectionPlantDialog;