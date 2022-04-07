import React, { useContext, useEffect, useState } from "react"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CreatePlantContext } from "../context/CreatePlantContext";
import MySelect from '../utils/components/MySelect';
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../data/enums";
import MyCheckboxList from "../utils/components/MyCheckboxList";
import { Divider, FormControl, Grid, Typography } from "@mui/material";
import '../assets/css/layout.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreatePlantPage = () => {
  const createPlantContext = useContext(CreatePlantContext)
  const [newPlant, setNewPlant] = useState(null)
  const [checkedBloomingMonths, setCheckedBloomingMonths] = useState(
    new Array(months.length).fill(false)
  );
  const [alertOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState("success")
  const [alertMsg, setAlertMsg] = useState("")

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
    createPlantContext.createPlantHandler(newPlant).then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully created plant!")
        reset()
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
      
    })
    
  }

  const setupAlert = (severity, msg) => {
    setSeverity(severity);
    setAlertMsg(msg);
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
    e.target.value = null;
  };

  const handleClick = () => {
    setAlertOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  return (
    <div>{newPlant &&
      <Box sx={{ padding: '2em' }}>
        <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {alertMsg}
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
            
            <MySelect label="Watering" options={watering} selected={newPlant.watering} onValueChange={(watering) => setNewPlant({...newPlant, watering})}/>
            <MySelect label="Light" options={light} selected={newPlant.light} onValueChange={(light) => setNewPlant({...newPlant, light})}/>
            <MySelect label="Growth rate" options={growthRate} selected={newPlant.growthRate} onValueChange={(growthRate) => setNewPlant({...newPlant, growthRate})}/>
            <MySelect label="Hardiness" options={hardiness} selected={newPlant.hardiness} onValueChange={(hardiness) => setNewPlant({...newPlant, hardiness})}/>
            <MySelect label="Height" options={height} selected={newPlant.height} onValueChange={(height) => setNewPlant({...newPlant, height})}/>
            <MySelect label="Life time" options={lifeTime} selected={newPlant.lifeTime} onValueChange={(lifeTime) => setNewPlant({...newPlant, lifeTime})}/>
            

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