import React, { useEffect, useState } from 'react';
import { Box } from "@mui/system"
import { useParams } from 'react-router-dom';
import { PlantService } from '../services/PlantService';
import { Grid } from "@mui/material"
import CategoryIcon from '@mui/icons-material/Category';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExpandIcon from '@mui/icons-material/Expand';
import YardIcon from '@mui/icons-material/Yard';
import HeightIcon from '@mui/icons-material/Height';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import Divider from '@mui/material/Divider';
import '../assets/css/layout.css';
import ListItem from '../components/ListItem'
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../data/enums";

const PlantPage = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null)

  useEffect(() => {
    const getData = async () => {
      try {
        setPlant(await PlantService.getOne(id))
      } catch(err) { console.log(err) }
    }
    getData()
  }, [id])

const getBloomingMonths = () => {
  var blm = "";
  plant.bloomingMonths.forEach(bm => {
    console.log(months[bm.month])
    blm += months[bm.month] + ", "
  })
  return blm
}

  return (
    <div>{
      plant &&
      <Box>
        <Grid container justifyContent="center" sx={{padding:'2em'}}>
          <Grid item md={6} >
            <h2 className="center">Plant parameters</h2>
            <Divider/>
            <ul className="plant-parameters-list">
              <ListItem icon={<CategoryIcon/>} name="Category" value={plant.category.name}/>
              <ListItem icon={<OpacityIcon/>} name="Watering" value={watering[plant.watering].name}/>
              <ListItem icon={<WbSunnyIcon/>} name="Light" value={light[plant.light].name}/>
              <ListItem icon={<ExpandIcon/>} name="Growth rate" value={growthRate[plant.growthRate].name}/>
              <ListItem icon={<YardIcon/>} name="Hardiness" value={hardiness[plant.hardiness].name}/>
              <ListItem icon={<HeightIcon/>} name="Height" value={height[plant.height].name}/>
              <ListItem icon={<FilterVintageIcon/>} name="Life time" value={lifeTime[plant.lifeTime].name}/>
              <ListItem icon={<FilterVintageIcon/>} name="Blooming months" value={getBloomingMonths()}/>
            </ul>
          </Grid>
          <Grid container item md={6} justifyContent="center" >
            <Box >
            <h1 className="center">{plant.name}</h1>
            <div className="placeholder-one-plant">
              <img src={plant.image}/>
            </div>
            </Box>
          </Grid>
          <Grid item md={12}>
            <h2>Plant description</h2>
            {plant.description}
          </Grid>
        </Grid>
        
      </Box>}
    </div>
  )
}

export default PlantPage