import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { amber, blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@mui/material/colors";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import OpacityIcon from '@mui/icons-material/Opacity';
import ParkIcon from '@mui/icons-material/Park';
import DraftsIcon from '@mui/icons-material/Drafts';
import GrassIcon from '@mui/icons-material/Grass';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/system";
import AddTaskDialog from "./AddTaskDialog";

const CollectionPlantCard = ({plant}) => {
  const collectionContext = useContext(CollectionContext);
  const [addTaskDialogOpened, setAddTaskDialogOpened] = useState(false);
  const colorHue = 200;
    
  const randomColor = () => {
    const colors = [red[colorHue], pink[colorHue], purple[colorHue], deepPurple[colorHue], indigo[colorHue], blue[colorHue],
    lightBlue[colorHue], cyan[colorHue], teal[colorHue], green[colorHue], lightGreen[colorHue], lime[colorHue],
    yellow[colorHue], amber[colorHue], orange[colorHue], deepOrange[colorHue], brown[colorHue]];

    var rand_index = Math.floor(Math.random() * colors.length);
    return colors[rand_index];
  }

  const addTask = (task) => {
    task.date = task.date.toISOString()//.slice(0, -1)
    console.log(task)
    task.plantID = plant.id;
    setAddTaskDialogOpened(false);
    collectionContext.addTaskHandler(task);
  }

  const setTaskDone = (id) => {
    console.log(id);
  }

  return (
    <div>
      <Card>
        {
          plant.image ?
          <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
          />
          : 
          <CardMedia
            sx={{height:'140px', bgcolor:randomColor()}}
          />
        }
        
        <CardContent>
          {
            plant.referent &&
            <div>
              <Typography gutterBottom variant="h5" component="div">
              {plant.nickname}
              </Typography>
              {/* TODO link to plant */}
              <Typography variant="subtitle1" color="text.secondary" component="div" sx={{textAlign:'right'}}>
                {plant.referent.name}
              </Typography>
            </div>
          }
          
          {
            plant.tasks &&
            <List>
            {
              plant.tasks.map((task, index) => 
                {if (task.status === "WAITING") {
                  return <ListItem disablePadding key={index}>
                  <ListItemButton sx={{padding:'0.3em 0 0.3em 0.3em'}}>
                    <ListItemIcon>
                      {
                        task.type === "watering" ? <OpacityIcon sx={{color: blue[300]}}/>
                        : (task.type === "transplant" ? <ParkIcon sx={{color: green[300]}}/>
                        : <GrassIcon sx={{color: green[300]}}/>)
                      }
                    </ListItemIcon>
                    <ListItemText primary={task.date} secondary={task.notes}/>
                    <Chip label={<CheckIcon color="primary"/>} onClick={() => setTaskDone(task.id)}/>
                  </ListItemButton>
                </ListItem>
                }}
              )
            }
            <ListItem disablePadding>
                <ListItemText/>
                <Chip label={<AddIcon/>} onClick={() => setAddTaskDialogOpened(true)} sx={{marginTop:'0.3em'}}/>
            </ListItem>
          </List>
          }
          
        </CardContent>
        <CardActions>
          <Button size="small" component={NavLink} to={`/plantcare/${collectionContext.collection.id}/plant/${plant.id}`}>See more</Button>
        </CardActions>
      </Card>
      <AddTaskDialog open={addTaskDialogOpened} handleCancel={() => setAddTaskDialogOpened(false)} handleSubmit={(task) => addTask(task)}/>
    </div>
    
  )
}

export default CollectionPlantCard;