import { Button, Divider, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext, useEffect, useState } from "react"
import { PlantsContext } from "../../context/plants/PlantsContext"
import { growthRate, hardiness, lifeTime, light, months, watering, height } from "../../data/enums"
import MyCheckboxList from "../../utils/components/MyCheckboxList"
import MySelect from "../../utils/components/MySelect"
import { appendURLSearchParams, appendURLSearchParamsWithBloomingMonths, appendURLSearchParamsWithCategories } from "../../utils/functions/filterPlants"

const FilterPanel = () => {
  const plantsContext = useContext(PlantsContext)
  const [categoryNames, setCategoryNames] = useState([])
  const [filterParameters, setFilterParameters] = useState(null)
  const [checkedBloomingMonths, setCheckedBloomingMonths] = useState(
    new Array(months.length).fill(false)
  );
  const [checkedCategories, setCheckedCategories] = useState([]);
  
  useEffect(() => {
    setFilterParameters({
      name: "",
      light: "none",
      watering: "none",
      isBlooming: "none",
      growthRate: "none",
      hardiness: "none",
      height: "none",
      lifeTime: "none"
    })
    setCheckedCategories(new Array(plantsContext.categories.length).fill(false))
    setCategoryNames(plantsContext.categories.map(cat => cat.name))
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
    const params = appendURLSearchParams(filterParameters);
    appendURLSearchParamsWithCategories(params, checkedCategories, categoryNames);
    appendURLSearchParamsWithBloomingMonths(params, checkedBloomingMonths);
    
    var url = params.toString()

    plantsContext.getPlantsHandler(url)
  }

  return (
    <div className="filterPlantsPanel">
      <Typography variant="h5" gutterBottom component="div">
        Filter plants
      </Typography>
      <Divider sx={{marginBottom:'1em'}}/>
      {filterParameters && 
        <div>
          <TextField fullWidth 
            sx={{ marginBottom: '10px'}} 
            label="Plant name" 
            variant="outlined" 
            value={filterParameters.name} 
            onChange={(e) => setFilterParameters({...filterParameters, name: e.target.value})} 
            onBlur={() => setFilterParameters({...filterParameters, name: filterParameters.name.trim()})}
          />

          <Box sx={{ padding:'20px 0'}}>
            <MyCheckboxList label="Popular Categories" options={categoryNames} isChecked={(index) => checkedCategories[index]} onValueChange={(index) => handleOnChangeCheckedCategories(index)}/>
          </Box>
          
          <MySelect label="Watering" options={watering} selected={filterParameters.watering} onValueChange={(watering) => setFilterParameters({...filterParameters, watering})} isFiltering={true}/>
          <MySelect label="Light" options={light} selected={filterParameters.light} onValueChange={(light) => setFilterParameters({...filterParameters, light})} isFiltering={true}/>
          <MySelect label="Growth rate" options={growthRate} selected={filterParameters.growthRate} onValueChange={(growthRate) => setFilterParameters({...filterParameters, growthRate})} isFiltering={true}/>
          <MySelect label="Hardiness" options={hardiness} selected={filterParameters.hardiness} onValueChange={(hardiness) => setFilterParameters({...filterParameters, hardiness})} isFiltering={true}/>
          <MySelect label="Height" options={height} selected={filterParameters.height} onValueChange={(height) => setFilterParameters({...filterParameters, height})} isFiltering={true}/>
          <MySelect label="Life time" options={lifeTime} selected={filterParameters.lifeTime} onValueChange={(lifeTime) => setFilterParameters({...filterParameters, lifeTime})} isFiltering={true}/>
          <MySelect label="Blooming" options={[{id: 0, name: "Blooming"}, {id: 1, name: "Not blooming"}]} selected={filterParameters.isBlooming} onValueChange={(isBlooming) => setFilterParameters({...filterParameters, isBlooming})} isFiltering={true}/>
        
          <Box sx={{ padding:'20px 0'}}>
            <MyCheckboxList label="Blooming months" options={months} isChecked={(index) => checkedBloomingMonths[index]} onValueChange={(index) => handleOnChangeCheckedBloomingMonths(index)}/>
          </Box>
        
          <Box sx={{ display: 'grid'}}>
            <Button variant="contained" onClick={() => filterPlants()}>Submit</Button>
          </Box>
        </div>
      }
      
    </div>
  )
}

export default FilterPanel