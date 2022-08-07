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
        id: 1,
        image: null,
        heading: 'Garden', //ovo je name
        description: 'This is place where I put my garden plants'
      },
      {
        id: 2,
        heading: 'Indoor plants',
        description: 'Here are all of my indoor plants'
      },
      {
        id: 3,
        heading: 'Adenium',
        description: 'Here are all of my adeniums'
      },
      {
        id: 4,
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