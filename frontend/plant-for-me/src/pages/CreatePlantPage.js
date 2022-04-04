import React, { useContext, useEffect, useState } from "react"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CreatePlantContext } from "../context/CreatePlantContext";
import Switch from '@material-ui/core/Switch';
import MySelect from '../utils/components/MySelect';
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../data/enums";
import MyCheckboxList from "../utils/components/MyCheckboxList";
import { Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import '../assets/css/layout.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreatePlantPage = () => {
  const createPlantContext = useContext(CreatePlantContext)
  const [newPlant, setNewPlant] = useState(null)
  const [wateringOptions, setWateringOptions] = useState(null)
  const [lightOptions, setLightOptions] = useState(null)
  const [growthRateOptions, setGrowthRateOptions] = useState(null)
  const [hardinessOptions, setHardinessOptions] = useState(null)
  const [heightOptions, setHeightOptions] = useState(null)
  const [lifeTimeOptions, setLifeTimeOptions] = useState(null)
  const [checkedBloomingMonths, setCheckedBloomingMonths] = useState(
    new Array(months.length).fill(false)
  );
  const [open, setOpen] = React.useState(false);

  const reset = () => {
    setNewPlant({
      name: "",
      description: "",
      image: null,
      categoryID: "",
      light: 0,
      watering: 0,
      isBlooming: false,
      bloomingMonths: [],
      growthRate: 0,
      hardiness: 0,
      height: 0,
      lifeTime: 0,
    })
  }

  useEffect(() => {
    reset()
    setWateringOptions(watering)
    setLightOptions(light)
    setGrowthRateOptions(growthRate)
    setHardinessOptions(hardiness)
    setHeightOptions(height)
    setLifeTimeOptions(lifeTime)
  }, [createPlantContext.categories])

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedBloomingMonths.map((item, index) => {
      if (index === position) {
        item = !item
        if(item === true) {
          setNewPlant({...newPlant, isBlooming: true})
        }
      } 
      return item
      }
    );

    var counter = 0;
    updatedCheckedState.forEach(item => {
      if(item === true) {
        setNewPlant({...newPlant, isBlooming: true})
      } else {
        counter += 1;
      }
    })
    if(counter === 12) {
      setNewPlant({...newPlant, isBlooming: false})
    }
    setCheckedBloomingMonths(updatedCheckedState);
  };

  const createNewPlant = () => {
    console.log(newPlant)
    if(!validateForm(newPlant)) {
      handleClick()
      return
    }
    // TODO trim
    
    checkedBloomingMonths.forEach((bm, index) => bm === true && newPlant.bloomingMonths.push(index))
    createPlantContext.createPlantHandler(newPlant)
    reset()
  }

  const validateForm = (plant) => {
    console.log(plant)
    return (plant["name"] !== ""
     && plant["categoryID"] !== "" 
     && plant["image"] !== null 
     && plant["description"].length > 100)
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
    setNewPlant({...newPlant, image: base64})
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>{newPlant &&
      <Box sx={{ padding: '2em' }}>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            You must fill in all the required fields
          </Alert>
        </Snackbar>
        <Typography variant="h1" sx={{ fontSize: '30px'}} component="div" gutterBottom>
          Create a plant
        </Typography>
        <Divider variant="middle" />
        <Grid container sx={{marginTop: '2em'}}>
          
          <Grid item md={4}>
            <FormControl fullWidth>
              <TextField sx={{ marginBottom: '10px'}} id="outlined-basic" label="Name" variant="outlined" value={newPlant.name} onChange={(e) => setNewPlant({...newPlant, name: e.target.value})} />
            </FormControl>

            {createPlantContext.categories && 
              <MySelect label="Category" options={createPlantContext.categories} selected={newPlant.categoryID} onValueChange={(categoryID) => setNewPlant({...newPlant, categoryID})}/>
            }
            
            <MySelect label="Watering" options={wateringOptions} selected={newPlant.watering} onValueChange={(watering) => setNewPlant({...newPlant, watering})}/>
            <MySelect label="Light" options={lightOptions} selected={newPlant.light} onValueChange={(light) => setNewPlant({...newPlant, light})}/>
            <MySelect label="Growth rate" options={growthRateOptions} selected={newPlant.growthRate} onValueChange={(growthRate) => setNewPlant({...newPlant, growthRate})}/>
            <MySelect label="Hardiness" options={hardinessOptions} selected={newPlant.hardiness} onValueChange={(hardiness) => setNewPlant({...newPlant, hardiness})}/>
            <MySelect label="Height" options={heightOptions} selected={newPlant.height} onValueChange={(height) => setNewPlant({...newPlant, height})}/>
            <MySelect label="Life time" options={lifeTimeOptions} selected={newPlant.lifeTime} onValueChange={(lifeTime) => setNewPlant({...newPlant, lifeTime})}/>
            

          </Grid>
          <Grid item md={2} sx={{ padding:'0 20px'}}>
            <MyCheckboxList label="Blooming months" options={months} isChecked={(index) => checkedBloomingMonths[index]} onValueChange={(index) => handleOnChange(index)}/>
          
          </Grid>
          <Grid item md={6}>
            <Button
              variant="contained"
              component="label"
            >
              Upload image
              <input type="file" onChange={(e) => handleFileUpload(e)} hidden/>
            </Button>
            
            <Typography variant="subtitle1" gutterBottom component="div">
              Image preview
            </Typography>
            <div className="image-placeholder">
              <img src={newPlant.image}/>
            </div>
            
            
          </Grid>
          <Grid item md={12}>
            <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              id="standard-multiline-flexible"
              label="Description"
              multiline
              maxRows={25}
              value={newPlant.description}
              onChange={(e) => setNewPlant({...newPlant, description: e.target.value})}
              variant="standard"
            />
            </FormControl>
            
          </Grid>
          <Grid container justifyContent="flex-end">
            <Button variant="contained" onClick={() => createNewPlant()}>Submit</Button>
          </Grid>
        </Grid>
      </Box>}
    </div>
  )
}

export default CreatePlantPage