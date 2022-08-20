import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { blue, green, orange,  red, yellow } from "@mui/material/colors";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OpacityIcon from '@mui/icons-material/Opacity';
import ParkIcon from '@mui/icons-material/Park';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import { Link, NavLink } from "react-router-dom";
import AddTaskDialog from "./AddTaskDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BugReportIcon from '@mui/icons-material/BugReport';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import format from 'date-fns/format'
import ClearIcon from '@mui/icons-material/Clear';
import { randomColor } from "../../utils/functions/randomColor";

const CollectionPlantCard = ({plant, isEditable}) => {
  const collectionContext = useContext(CollectionContext);
  const [addTaskDialogOpened, setAddTaskDialogOpened] = useState(false);

  const deleteCollectionPlant = () => {
    collectionContext.deleteCollectionPlantHandler(plant.id)
    .then(res => {
      if(res.ok) {
        toast.success("Successfully deleted collection plant!");
        collectionContext.getCollectionPlantsHandler();
      } else {
        toast.error(res.err)
      }
    })
  }

  const addTask = (task) => {
    task.date = task.date.toISOString()
    task.collectionPlantId = plant.id;
    
    collectionContext.addTaskHandler(task).then(res => {
      if(res.ok) {
        toast.success("Successfully added task!");
        collectionContext.getCollectionPlantsHandler();
        setAddTaskDialogOpened(false);
      } else {
        toast.error(res.err)
      }
    })
  }

  const setTaskDone = (id) => {
    collectionContext.setTaskToDoneHandler(id).then(res => {
      if(res.ok) {
        toast.success("Task is done");
        collectionContext.getCollectionPlantsHandler();
      } else {
        toast.error(res.err)
      }
    })
  }

  const deleteTask = (id) => {
    collectionContext.deleteTaskHandler(id).then(res => {
      if(res.ok) {
        toast.success("Task is deleted");
        collectionContext.getCollectionPlantsHandler();
      }
      else {
        toast.error(res.err)
      }
    })
  }

  const getTaskStatus = (status) => {
    switch(status) {
      case 0: return "WAITING";
      case 1: return "DONE";
      case 2: return "PASSED";
      default: return ""
    }
  }

  const getFormattedDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy')
  }

  return (
    <div>
      <Card>
        {
          plant.base64Image ?
          <CardMedia
            component="img"
            height={isEditable ? "140" : "300"}
            image={plant.base64Image}
            alt={plant.referentPlantName}
          />
          : 
          <CardMedia
            
            sx={isEditable ? {height:'140px', bgcolor:randomColor()} : {height:'300px', bgcolor:randomColor()}}
          ><div></div></CardMedia>
        }
        
        <CardContent>
          <div>
            <Typography gutterBottom variant="h5" component="div">
            {plant.nickname}
            </Typography>
            
            {/* TODO link to plant */}
            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{textAlign:'right'}}>
              <Link to={`/plants/${plant.referentPlantId}`}>{plant.referentPlantName}</Link>
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Tasks
            </Typography>
          </div>
          
          {
            plant.tasks &&
            <List>
            {
              plant.tasks.map((task, index) => 
                {if (task.status === 0 && isEditable) {
                  return <ListItem disablePadding key={index}>
                    <ListItemButton sx={{padding:'0.3em 0 0.3em 0.3em'}}>
                      <ListItemIcon>
                        {
                          task.type === 0 ? <OpacityIcon sx={{color: blue[300]}}/>
                          : (task.type === 1 ? <ParkIcon sx={{color: green[300]}}/>
                          : (task.type === 2 ? <ContentCutIcon sx={{color: green[300]}}/>
                          : (task.type === 3 ? <FormatColorFillIcon sx={{color:yellow[300]}}/>
                          : (task.type === 4 ? <SentimentVeryDissatisfiedIcon sx={{color:orange[300]}}/>
                          : <BugReportIcon sx={{color:red[300]}}/>))))
                        }
                      </ListItemIcon>
                      <ListItemText primary={getFormattedDate(task.date)} secondary={task.notes}/>
                      <Chip label={<CheckIcon color="primary"/>} onClick={() => setTaskDone(task.id)}/>
                      <Chip label={<ClearIcon color="error"/>} onClick={() => deleteTask(task.id)}
                      sx={{marginLeft:'0.5em'}}/>
                    </ListItemButton>
                  </ListItem>
                } else {
                  return <ListItem disablePadding key={index}>
                    <ListItemButton sx={{padding:'0.3em 0 0.3em 0.3em'}}>
                      <ListItemIcon>
                        {
                          task.type === 0 ? <OpacityIcon sx={{color: blue[300]}}/>
                          : (task.type === 1 ? <ParkIcon sx={{color: green[300]}}/>
                          : (task.type === 2 ? <ContentCutIcon sx={{color: green[300]}}/>
                          : (task.type === 3 ? <FormatColorFillIcon sx={{color:yellow[300]}}/>
                          : (task.type === 4 ? <SentimentVeryDissatisfiedIcon sx={{color:orange[300]}}/>
                          : <BugReportIcon sx={{color:red[300]}}/>))))
                        }
                      </ListItemIcon>
                      <ListItemText primary={getFormattedDate(task.date)} secondary={task.notes}/>
                      <Chip label={getTaskStatus(task.status)} />
                    </ListItemButton>
                  </ListItem>
                }}
              )
            }
            {
              isEditable &&
              <ListItem disablePadding>
                <ListItemText/>
                <Chip label={<AddIcon/>} onClick={() => setAddTaskDialogOpened(true)} sx={{marginTop:'0.3em'}}/>
              </ListItem>
            }
            
          </List>
          }
          
        </CardContent>
        {
          isEditable &&
          <CardActions>
            <Button size="small" component={NavLink} to={`/plantcare/${collectionContext.collection.id}/plant/${plant.id}`}>See more</Button>
            <Button size="small" onClick={() => deleteCollectionPlant()}><DeleteIcon/></Button>
          </CardActions>
        }
      </Card>
      <AddTaskDialog open={addTaskDialogOpened} handleCancel={() => setAddTaskDialogOpened(false)} handleSubmit={(task) => addTask(task)}/>
    </div>
    
  )
}

export default CollectionPlantCard;