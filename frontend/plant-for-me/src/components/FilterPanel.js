import { Button, Divider, FormControl,  Grid, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext, useEffect, useState } from "react"
import { PlantsContext } from "../context/PlantsContext"
import { growthRate, hardiness, lifeTime, light, months, watering, height } from "../data/enums"
import MyCheckboxList from "../utils/components/MyCheckboxList"
import MySelect from "../utils/components/MySelect"

const FilterPanel = () => {
  const plantsContext = useContext(PlantsContext)
  const [categories, setCategories] = useState([])
  const [filterParameters, setFilterParameters] = useState(null)
  const [checkedBloomingMonths, setCheckedBloomingMonths] = useState(
    new Array(months.length).fill(false)
  );
  const [checkedCategories, setCheckedCategories] = useState([]);
  
  useEffect(() => {
    setFilterParameters({
      name: "",
      light: "-1",
      watering: "-1",
      isBlooming: "-1",
      growthRate: "-1",
      hardiness: "-1",
      height: "-1",
      lifeTime: "-1"
    })
    setCheckedCategories(new Array(plantsContext.categories.length).fill(false))
    setCategories(plantsContext.categories.map(cat => cat.name))
  }, [plantsContext.categories])

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
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filterParameters)) {
      if(key === "isBlooming" && value !== "-1") {
        value === 0 ? params.append(key, true) : params.append(key, false)
        continue;
      }
      if(value !== "-1" && value !== "") {
        params.append(key, value)
      }
      
    }

    checkedCategories.forEach((cc, index) => cc === true && params.append('category', categories[index]))
    checkedBloomingMonths.forEach((bm, index) => bm === true && params.append('bloomingMonth', index))
    
    var url = params.toString()

    plantsContext.handleGetAll(url)
  }

  return (
    <div className="filterPlantsPanel">
      <Typography variant="h5" gutterBottom component="div">
        Filter plants
      </Typography>
      <Divider sx={{marginBottom:'1em'}}/>
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
      <MySelect label="Blooming" options={[{id: 0, name: "Blooming"}, {id: 1, name: "Not blooming"}]} selected={filterParameters.isBlooming} onValueChange={(isBlooming) => setFilterParameters({...filterParameters, isBlooming})}/>
      
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