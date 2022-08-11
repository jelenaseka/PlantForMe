import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { amber, blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@mui/material/colors";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import PlantCarePage from "../../pages/plantcare/PlantCarePage";
import { PlantCareContext } from "../../context/plantcare/PlantCareContext"
import { CollectionService } from "../../services/plantcare/CollectionService";

const PlantCareContainer = () => {
  const [collections, setCollections] = useState([]);

  
  useEffect(() => {
    getMyCollectionsHandler();
  }, [])

  const getMyCollectionsHandler = () => {
    const getMyCollections = CollectionService.getMyCollections()
      .then(async res => {
        if(res.ok) {
          const data = await res.json()
          console.log(data)
          setCollections(data)
        } else {

        }
      }).catch(err => console.log(err))

    return getMyCollections;
  }

  const addCollectionHandler = (collection) => {
    const addCollection = CollectionService.createCollection(collection)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text()
          return { ok: false, err: data }
        }
      }).catch(err => console.log(err))
    return addCollection;
  }

  const deleteCollectionHandler = (id) => {
    const deleteCollection = CollectionService.deleteCollection(id)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text()
          return { ok: false, err: data }
        }
      }).catch(err => console.log(err))
    return deleteCollection;
  }

  

  return (
    <PlantCareContext.Provider value={{collections, getMyCollectionsHandler, addCollectionHandler, deleteCollectionHandler}}>
      <PlantCarePage/>
    </PlantCareContext.Provider>
  )
}

export default PlantCareContainer;