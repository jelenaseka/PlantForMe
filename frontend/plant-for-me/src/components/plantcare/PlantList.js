import React, { useContext } from "react";
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { grey } from "@mui/material/colors";
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import {  ListItemButton } from "@mui/material";


const PlantList = ({handleSubmit, selectedId, setSelectedPlant}) => {
  const collectionContext = useContext(CollectionContext);
  

  return (
      <List sx={{ width: '100%',bgcolor:grey[200], borderRadius:'4px' }}>
        {
          collectionContext.allPlants.map((plant, index) => (
            <ListItemButton key={index}
              selected={selectedId === plant.id}
              onClick={() => setSelectedPlant(plant)}
            >
              <ListItemAvatar>
                <Avatar alt={plant.name} src={plant.image}>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={plant.name} />
            </ListItemButton>
          ))
        }
      </List>
      
  )
}

export default PlantList;