import React, { useContext, useState } from 'react';
import { Box } from "@mui/system"
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, CardContent, CardHeader, FormControl, Grid, IconButton, Menu, MenuItem, Paper, Rating, TextField, Typography } from "@mui/material"
import CategoryIcon from '@mui/icons-material/Category';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExpandIcon from '@mui/icons-material/Expand';
import YardIcon from '@mui/icons-material/Yard';
import HeightIcon from '@mui/icons-material/Height';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import Divider from '@mui/material/Divider';
import '../../assets/css/layout.css';
import ListItem from '../../components/plants/ListItem'
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../../data/enums";
import { PlantContext } from '../../context/plants/PlantContext';
import { toast, ToastContainer } from 'react-toastify';
import PlantRatings from '../../components/plants/PlantRatings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { green, red, yellow } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PlantPage = () => {
  const plantContext = useContext(PlantContext);
  let navigate = useNavigate();
  const [review, setReview] = useState("");
  const [rating, setRating] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getBloomingMonths = () => {
    var blm = "";
    plantContext.plant.bloomingMonths.forEach(bm => {
      console.log(months[bm.month])
      blm += months[bm.month] + ", "
    })
    return blm
  }

  const deletePlant = () => {
    plantContext.deletePlantHandler().then(res => {
      if(res.ok) {
        navigate("/plants");
      } else {
        //todo error
        toast.error(res.err);
      }
    })
  }


  return (
    <div>
      {
      plantContext.plant &&
      <Box>
        <Grid container >
          <Grid item md={4} sm={12} xs={12} sx={{padding:'2em'}}>
            <Card >
              <CardHeader
                action={
                  <IconButton aria-label="settings" onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Plant Features"
              />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem component={Link} to={"/plants/update/" + plantContext.plant.id} >
                  <EditIcon sx={{ color: green[500] }}/>
                </MenuItem>
                <MenuItem onClick={() => deletePlant()}>
                  <DeleteIcon/>
                </MenuItem>
              </Menu>
              <Divider/>
              <CardContent>
                <ul className="plant-parameters-list">
                  {/* <ListItem icon={<CategoryIcon/>} name="Category" value={plantContext.plant.category.name}/> */}
                  <ListItem icon={<OpacityIcon/>} name="Watering" value={watering[plantContext.plant.watering].name}/>
                  <ListItem icon={<WbSunnyIcon/>} name="Light" value={light[plantContext.plant.light].name}/>
                  <ListItem icon={<ExpandIcon/>} name="Growth rate" value={growthRate[plantContext.plant.growthRate].name}/>
                  <ListItem icon={<YardIcon/>} name="Hardiness" value={hardiness[plantContext.plant.hardiness].name}/>
                  <ListItem icon={<HeightIcon/>} name="Height" value={height[plantContext.plant.height].name}/>
                  <ListItem icon={<FilterVintageIcon/>} name="Life time" value={lifeTime[plantContext.plant.lifeTime].name}/>
                  <ListItem icon={<FilterVintageIcon/>} name="Blooming months" value={getBloomingMonths()}/>
                </ul>
              </CardContent>
              
            </Card>
              
          </Grid>
          <Grid item md={8} sm={12} sx={{padding:'2em'}}>
            <h1 className='plant-name-font'>{plantContext.plant.name}</h1>
            <div className="placeholder-one-plant">
              <img  src={plantContext.plant.image} alt="Your plant"/>
            </div>
          </Grid>
        </Grid>
        <Box sx={{padding:'2em'}}>
          <Typography variant="h5" gutterBottom component="div" sx={{marginBottom:'1em'}}>
            Plant description
          </Typography>
          {plantContext.plant.description}
        </Box>
        <PlantRatings/>
      </Box>
      }
      <ToastContainer />
    </div>
  )
}

export default PlantPage