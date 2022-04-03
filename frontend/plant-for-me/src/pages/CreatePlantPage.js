import React, { useContext, useEffect, useState } from "react"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CreatePlantContext } from "../context/CreatePlantContext";
import Switch from '@material-ui/core/Switch';
import MySelect from '../utils/components/MySelect';
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../data/enums";
import MyCheckboxList from "../utils/components/MyCheckboxList";


const CreatePlantPage = () => {
  const plantContext = useContext(CreatePlantContext)
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
    console.log(plantContext.categories)
    console.log(plantContext.plants)
    reset()
    setWateringOptions(watering)
    setLightOptions(light)
    setGrowthRateOptions(growthRate)
    setHardinessOptions(hardiness)
    setHeightOptions(height)
    setLifeTimeOptions(lifeTime)
  }, [plantContext.categories])

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
    // if(!validateForm(newPlant)) return;
    checkedBloomingMonths.forEach((bm, index) => bm === true && newPlant.bloomingMonths.push(index))
    plantContext.createPlantHandler(newPlant)
    reset()
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
    console.log(base64)
  };

  return (
    <div>
      Create a plant
      {
        newPlant &&
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <input type="file" onChange={(e) => handleFileUpload(e)}/>
          <img src={newPlant.image}/>
          <TextField id="outlined-basic" label="Name" variant="outlined" value={newPlant.name} onChange={(e) => setNewPlant({...newPlant, name: e.target.value})} />
          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            maxRows={4}
            value={newPlant.description}
            onChange={(e) => setNewPlant({...newPlant, description: e.target.value})}
            variant="standard"
          />
          {plantContext.categories && 
            <MySelect label="Category" options={plantContext.categories} selected={newPlant.categoryID} onValueChange={(categoryID) => setNewPlant({...newPlant, categoryID})}/>
          }
          
          <MySelect label="Watering" options={wateringOptions} selected={newPlant.watering} onValueChange={(watering) => setNewPlant({...newPlant, watering})}/>
          <MySelect label="Light" options={lightOptions} selected={newPlant.light} onValueChange={(light) => setNewPlant({...newPlant, light})}/>
          <MySelect label="Growth rate" options={growthRateOptions} selected={newPlant.growthRate} onValueChange={(growthRate) => setNewPlant({...newPlant, growthRate})}/>
          <MySelect label="Hardiness" options={hardinessOptions} selected={newPlant.hardiness} onValueChange={(hardiness) => setNewPlant({...newPlant, hardiness})}/>
          <MySelect label="Height" options={heightOptions} selected={newPlant.height} onValueChange={(height) => setNewPlant({...newPlant, height})}/>
          <MySelect label="Life time" options={lifeTimeOptions} selected={newPlant.lifeTime} onValueChange={(lifeTime) => setNewPlant({...newPlant, lifeTime})}/>
          
          <MyCheckboxList label="Blooming months" options={months} isChecked={(index) => checkedBloomingMonths[index]} onValueChange={(index) => handleOnChange(index)}/>
            

          <Switch checked={newPlant.isBlooming} disabled/>
          <Button variant="contained" onClick={() => createNewPlant()}>Submit</Button>
        </Box>}
    </div>
  )
}

export default CreatePlantPage