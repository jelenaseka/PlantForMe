import { Button, Divider, FormControl, Grid, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import { growthRate, hardiness, lifeTime, light, months, watering, height } from "../../data/enums"
import MyCheckboxList from "../../utils/components/MyCheckboxList"
import MySelect from "../../utils/components/MySelect"
import { toast } from 'react-toastify';
import { handleFileUpload } from "../../utils/functions/imageHandler"

const PlantEditPanel = ({plant, categories, handlePlantOperation, handleBack, title}) => {
  const [newPlant, setNewPlant] = useState(null)
  const [checkedBloomingMonths, setCheckedBloomingMonths] = useState(
    new Array(months.length).fill(false)
  );

  useEffect(() => {
    setNewPlant(plant)
    if(plant) {
      var updatedCheckedState = checkedBloomingMonths;
      plant.bloomingMonths.forEach(item => {
        updatedCheckedState[item.month] = true;
      });
      setCheckedBloomingMonths(updatedCheckedState);
    }
  }, [plant])


  const handleBloomingMonthsOnChange = (position) => {
    const updatedCheckedState = checkedBloomingMonths.map((item, index) => {
      if (index === position) {
        item = !item
        if(item === true) {
          setNewPlant({...newPlant, isBlooming: true});
        }
      } 
      return item;
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

  const handleNewPlant = () => {
    if(!validateForm(newPlant)) {
      toast.error("Form not valid");
      return;
    }
    
    newPlant.bloomingMonths = []
    checkedBloomingMonths.forEach((bm, index) => bm === true && newPlant.bloomingMonths.push(index))
    
    handlePlantOperation(newPlant);
  }

  const fileUpload = (e) => {
    handleFileUpload(e, (base64) => setNewPlant({...newPlant, image: base64}));
  }

  const validateForm = (plant) => {
    return (
        plant["name"] !== ""
     && plant["categoryID"] !== ""
     && plant["image"] !== null 
     && plant["description"].length > 100)
  }

  return (
    <div>{newPlant &&
      <Box sx={{ padding: '2em' }}>
        {/* <ToastContainer /> */}
        <Typography variant="h1" sx={{ fontSize: '30px'}} component="div" gutterBottom>
          {title}
        </Typography>
        <Divider variant="middle" />
        <Grid container sx={{marginTop: '2em'}}>
          
          <Grid item md={4}>
            <FormControl fullWidth>
              <TextField 
                sx={{ marginBottom: '10px'}} 
                id="outlined-basic" 
                label="Name" 
                variant="outlined" 
                value={newPlant.name} 
                onChange={(e) => setNewPlant({...newPlant, name: e.target.value})} 
                onBlur={() => setNewPlant({...newPlant, name: newPlant.name.trim()})}
              />
            </FormControl>

            {categories && 
              <MySelect label="Category" options={categories} selected={newPlant.categoryID} onValueChange={(categoryID) => setNewPlant({...newPlant, categoryID})} isFiltering={false} />
            }
            
            <MySelect label="Watering" options={watering} selected={newPlant.watering} onValueChange={(watering) => setNewPlant({...newPlant, watering})} isFiltering={false}/>
            <MySelect label="Light" options={light} selected={newPlant.light} onValueChange={(light) => setNewPlant({...newPlant, light})} isFiltering={false}/>
            <MySelect label="Growth rate" options={growthRate} selected={newPlant.growthRate} onValueChange={(growthRate) => setNewPlant({...newPlant, growthRate})} isFiltering={false}/>
            <MySelect label="Hardiness" options={hardiness} selected={newPlant.hardiness} onValueChange={(hardiness) => setNewPlant({...newPlant, hardiness})} isFiltering={false}/>
            <MySelect label="Height" options={height} selected={newPlant.height} onValueChange={(height) => setNewPlant({...newPlant, height})} isFiltering={false}/>
            <MySelect label="Life time" options={lifeTime} selected={newPlant.lifeTime} onValueChange={(lifeTime) => setNewPlant({...newPlant, lifeTime})} isFiltering={false}/>
            

          </Grid>
          <Grid item md={2} sx={{ padding:'0 20px'}}>
            <MyCheckboxList label="Blooming months" options={months} isChecked={(index) => checkedBloomingMonths[index]} onValueChange={(index) => handleBloomingMonthsOnChange(index)}/>
          </Grid>

          <Grid item md={6}  sx={{padding:'0 0.8em'}}>
            <Button variant="contained" component="label">
              Upload image
              <input type="file" onChange={(e) => fileUpload(e)} hidden/>
            </Button>
            
            <Typography variant="subtitle1" gutterBottom component="div">
              Image preview
            </Typography>
            <div className="image-placeholder">
              <img src={newPlant.image} alt='Your plant'/>
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
                onBlur={() => setNewPlant({...newPlant, description: newPlant.description.trim()})}
                variant="standard"
              />
            </FormControl>
            
          </Grid>
          <Grid container justifyContent="flex-end">
            <Button variant="contained" onClick={() => handleBack()} sx={{marginRight:'0.5em'}}>Back</Button>
            <Button variant="contained" onClick={() => handleNewPlant(newPlant)}>Submit</Button>
          </Grid>
        </Grid>
      </Box>
      }
    </div>
  )
}

export default PlantEditPanel;