import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box } from "@mui/system";
import PlantList from "./PlantList";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddCollectionPlantDialog = ({open, handleCancel, handleSubmit}) => {
  const [collectionPlant, setCollectionPlant] = useState({
    collectionId:"",
    nickname:"",
    referentPlantId:null,
    referentPlantName:"",
    base64Image:null
  })

  const submit = () => {
    if(collectionPlant.referentPlantId === null) {
      toast.error("You did not selected any plant");
      return;
    }
    handleSubmit(collectionPlant);
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    setCollectionPlant({...collectionPlant, base64Image: base64});
    e.target.value = null;
  };

  return (
    <Dialog
        fullScreen
        open={open}
        onClose={handleCancel}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCancel}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add plant to your collection
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{padding: '2em'}}>
          <Typography variant="body1" gutterBottom>
            You can only choose plant from our collection
          </Typography>
          <Box sx={{display:'flex', justifyContent:'space-between',bgcolor:grey[200]}}>
            <PlantList handleSubmit={(selectedId) => handleSubmit(selectedId)} selectedId={collectionPlant.referentPlantId} setSelectedPlant={(e) => setCollectionPlant({...collectionPlant, referentPlantId:e.id, referentPlantName:e.name })}/>
            <Box sx={{padding:'2em', width:'100%', textAlign:'right'}}>
              <TextField
                sx={{marginBottom:'1em'}}
                autoFocus
                margin="dense"
                label="Plant nickname"
                type="text"
                fullWidth
                value={collectionPlant.nickname}
                onChange={(e) => setCollectionPlant({...collectionPlant, nickname: e.target.value})}
                onBlur={() => setCollectionPlant({...collectionPlant, nickname: collectionPlant.nickname.trim()})} 
                variant="standard"
              />
              <Button
                variant="contained"
                sx={{color:"white"}}
                component="label"
              >
                Upload image
                <input type="file" onChange={(e) => handleFileUpload(e)} hidden/>
              </Button>
              
              <div className="image-placeholder">
                <img src={collectionPlant.base64Image} />
              </div>
            </Box>
          </Box>
          

          <Box sx={{display:'flex', justifyContent:'end', bgcolor: grey[200], padding:'1em', borderBottomLeftRadius:'4px', borderBottomRightRadius:'4px'}}>
            <Button variant="contained" sx={{color: "white"}} onClick={() => submit()}>submit</Button>
          </Box>
        </Box>
      </Dialog>
  )
}

export default AddCollectionPlantDialog;