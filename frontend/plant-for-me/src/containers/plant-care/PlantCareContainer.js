import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { amber, blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@mui/material/colors";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import PlantCarePage from "../../pages/plantcare/PlantCarePage";
import { PlantCareContext } from "../../context/plantcare/PlantCareContext"

const PlantCareContainer = () => {
  const [collections, setCollections] = useState([]);

  
  useEffect(() => {
    setCollections([
      {
        image: null,
        heading: 'Garden',
        description: 'This is place where I put my garden plants'
      },
      {
        heading: 'Indoor plants',
        description: 'Here are all of my indoor plants'
      },
      {
        heading: 'Adenium',
        description: 'Here are all of my adeniums'
      },
      {
        heading: 'Cactuses',
        description: ''
      }
    ])
  }, [])

  return (
    <PlantCareContext.Provider value={{collections}}>
      <PlantCarePage/>
    </PlantCareContext.Provider>
  )
}

export default PlantCareContainer;