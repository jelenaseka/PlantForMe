import { Card, CardContent, CardHeader, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useContext, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PlantContext } from "../../context/plants/PlantContext";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { watering, light, lifeTime, growthRate, hardiness, height, months } from "../../data/enums";
import CategoryIcon from '@mui/icons-material/Category';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExpandIcon from '@mui/icons-material/Expand';
import YardIcon from '@mui/icons-material/Yard';
import HeightIcon from '@mui/icons-material/Height';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import ListItem from '../../components/plants/ListItem'
import { Link, useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";
import { toast } from 'react-toastify';
import { tokenIsExpired } from "../../utils/functions/jwt";
import { AuthService } from "../../services/auth/AuthService";

const PlantFeatures = () => {
  const plantContext = useContext(PlantContext);
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const deletePlant = () => {
    if(tokenIsExpired() || plantContext.currentUser === null) {
      AuthService.logout();
      navigate("/login");
      return;
    }
    plantContext.deletePlantHandler().then(res => {
      if(res.ok) {
        navigate("/plants");
      } else {
        toast.error(res.err);
      }
    })
  }

  const getBloomingMonths = () => {
    var blm = "";
    plantContext.plant.bloomingMonths.forEach(bm => {
      console.log(months[bm.month])
      blm += months[bm.month] + ", "
    })
    return blm
  }

  return (
    <Card >
      <CardHeader
        action={ (plantContext.currentUser && (plantContext.currentUser.role === 1 || plantContext.currentUser.role === 2)) &&
          <IconButton aria-label="settings" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        }
        title="Plant Features"
      />
      {
        (plantContext.currentUser && (plantContext.currentUser.role === 1 || plantContext.currentUser.role === 2)) &&
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
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
      }
      
        
      <Divider/>
      <CardContent>
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
      </CardContent>
      
    </Card>
  )
}

export default PlantFeatures;