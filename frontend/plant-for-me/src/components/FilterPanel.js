import { Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext, useEffect, useState } from "react"
import Plant from "../components/Plant"
import { PlantsContext } from "../context/PlantsContext"
import { growthRate, hardiness, lifeTime, light, months, watering, height } from "../data/enums"
import MyCheckboxList from "../utils/components/MyCheckboxList"
import MySelect from "../utils/components/MySelect"

const FilterPanel = () => {
  const plantContext = useContext(PlantsContext)
  const [filterParameters, setFilterParameters] = useState(null)
  const [checkedBloomingMonths, setCheckedBloomingMonths] = useState(
    new Array(months.length).fill(false)
  );
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [categories, setCategories] = useState([])
  
  useEffect(() => {
    setFilterParameters({
      name: "",
      categoryID: "",
      light: 0,
      watering: 0,
      isBlooming: false,
      bloomingMonths: [],
      growthRate: 0,
      hardiness: 0,
      height: 0,
      lifeTime: 0
    })
    setCheckedCategories(new Array(plantContext.categories.length).fill(false))
    setCategories(plantContext.categories.map(cat => cat.name))
  }, [plantContext.categories])

  const handleOnChangeCheckedCategories = (position) => {
    const updatedCheckedCategories = checkedCategories.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedCategories(updatedCheckedCategories);
  };

  const handleOnChangeCheckedBloomingMonths = (position) => {
    const updatedCheckedBloomingMonths = checkedBloomingMonths.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedBloomingMonths(updatedCheckedBloomingMonths);
  };

  const filterPlants = () => {

  }


  return (
    
    <div className="filterPlantsPanel">
      {filterParameters && <div>
        <FormControl fullWidth>
        <TextField sx={{ marginBottom: '10px'}} id="outlined-basic" label="Plant name" variant="outlined" value={filterParameters.name} onChange={(e) => setFilterParameters({...filterParameters, name: e.target.value})} />
      </FormControl>

      <Grid item sx={{ padding:'20px 0'}}>
        <MyCheckboxList label="Popular Categories" options={categories} isChecked={(index) => checkedCategories[index]} onValueChange={(index) => handleOnChangeCheckedCategories(index)}/>
      </Grid>
      
      <MySelect label="Watering" options={watering} selected={filterParameters.watering} onValueChange={(watering) => setFilterParameters({...filterParameters, watering})}/>
      <MySelect label="Light" options={light} selected={filterParameters.light} onValueChange={(light) => setFilterParameters({...filterParameters, light})}/>
      <MySelect label="Growth rate" options={growthRate} selected={filterParameters.growthRate} onValueChange={(growthRate) => setFilterParameters({...filterParameters, growthRate})}/>
      <MySelect label="Hardiness" options={hardiness} selected={filterParameters.hardiness} onValueChange={(hardiness) => setFilterParameters({...filterParameters, hardiness})}/>
      <MySelect label="Height" options={height} selected={filterParameters.height} onValueChange={(height) => setFilterParameters({...filterParameters, height})}/>
      <MySelect label="Life time" options={lifeTime} selected={filterParameters.lifeTime} onValueChange={(lifeTime) => setFilterParameters({...filterParameters, lifeTime})}/>
      
      
      <FormControlLabel
        value="start"
        control={<Switch checked={filterParameters.isBlooming} onChange={(event) => setFilterParameters({...filterParameters, isBlooming: event.target.checked})}/>}
        label="Is blooming"
        labelPlacement="start"
      />

      <Grid item md={2} sx={{ padding:'0 20px'}}>
        <MyCheckboxList label="Blooming months" options={months} isChecked={(index) => checkedBloomingMonths[index]} onValueChange={(index) => handleOnChangeCheckedBloomingMonths(index)}/>
      
      </Grid>
      
      <Box
        sx={{
          display: 'grid',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          p: 1,
          marginTop: '10px',
          fontSize: '0.875rem',
          fontWeight: '700',
        }}
      >
        <Button variant="contained" onClick={() => filterPlants()}>Submit</Button>
      </Box>
      </div>}
      
    </div>
  )
}

export default FilterPanel