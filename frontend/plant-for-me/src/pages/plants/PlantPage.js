import React, { useContext } from 'react';
import { Box } from "@mui/system"
import { NavLink } from 'react-router-dom';
import { Button, Grid } from "@mui/material"
import CategoryIcon from '@mui/icons-material/Category';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExpandIcon from '@mui/icons-material/Expand';
import YardIcon from '@mui/icons-material/Yard';
import HeightIcon from '@mui/icons-material/Height';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import Divider from '@mui/material/Divider';
import '../../assets/css/layout.css';
import ListItem from '../../components/ListItem'
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../../data/enums";
import { PlantContext } from '../../context/plants/PlantContext';

const PlantPage = () => {
  const plantContext = useContext(PlantContext)

  const getBloomingMonths = () => {
    var blm = "";
    plantContext.plant.bloomingMonths.forEach(bm => {
      console.log(months[bm.month])
      blm += months[bm.month] + ", "
    })
    return blm
  }

  return (
    <div>{
      plantContext.plant &&
      <Box>
        <Grid container justifyContent="center" sx={{padding:'2em'}}>
          <Grid item md={6} >
            <h2 className="center">Plant parameters</h2>
            <Divider/>
            <ul className="plant-parameters-list">
              <ListItem icon={<CategoryIcon/>} name="Category" value={plantContext.plant.category.name}/>
              <ListItem icon={<OpacityIcon/>} name="Watering" value={watering[plantContext.plant.watering].name}/>
              <ListItem icon={<WbSunnyIcon/>} name="Light" value={light[plantContext.plant.light].name}/>
              <ListItem icon={<ExpandIcon/>} name="Growth rate" value={growthRate[plantContext.plant.growthRate].name}/>
              <ListItem icon={<YardIcon/>} name="Hardiness" value={hardiness[plantContext.plant.hardiness].name}/>
              <ListItem icon={<HeightIcon/>} name="Height" value={height[plantContext.plant.height].name}/>
              <ListItem icon={<FilterVintageIcon/>} name="Life time" value={lifeTime[plantContext.plant.lifeTime].name}/>
              <ListItem icon={<FilterVintageIcon/>} name="Blooming months" value={getBloomingMonths()}/>
            </ul>
          </Grid>
          <Grid container item md={6} justifyContent="center" >
            
            <Box >
            <Button variant="contained">
              <NavLink to={"/plants/update/" + plantContext.plant.id} className="plant-edit-button">
                Edit plant
              </NavLink>
            </Button>
            <Button variant="contained" onClick={() => plantContext.deletePlantHandler()}>
                Delete plant
            </Button>
            <h1 className="center">{plantContext.plant.name}</h1>
            <div className="placeholder-one-plant">
              <img  src={plantContext.plant.image} alt="Your plant"/>
            </div>
            </Box>
          </Grid>
          <Grid item md={12}>
            <h2>Plant description</h2>
            {plantContext.plant.description}
          </Grid>
        </Grid>
        
      </Box>}
    </div>
  )
}

export default PlantPage