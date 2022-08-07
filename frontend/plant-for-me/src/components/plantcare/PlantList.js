import React, { useContext, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { grey, red } from "@mui/material/colors";
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import { Button, Checkbox, ListItemButton } from "@mui/material";
import { Box } from "@mui/system";


const PlantList = ({handleSubmit, selectedId, setSelectedId}) => {
  const collectionContext = useContext(CollectionContext);
  

  return (
      <List sx={{ width: '100%',bgcolor:grey[200], borderRadius:'4px' }}>
        {
          collectionContext.allPlants.map((plant, index) => (
            <ListItemButton key={index}
              selected={selectedId === plant.id}
              onClick={() => setSelectedId(plant.id)}
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