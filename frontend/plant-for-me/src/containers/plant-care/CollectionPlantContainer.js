import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CollectionPlantContext } from "../../context/plantcare/CollectionPlantContext";
import CollectionPlantPage from "../../pages/plantcare/CollectionPlantPage";
import { CollectionPlantService } from "../../services/plantcare/CollectionPlantService";

const CollectionPlantContainer = () => {
  const { collectionid, plantid } = useParams();
  const [ collectionPlant, setCollectionPlant ] = useState({})

  useEffect(() => {
    getCollectionPlantHandler()
  }, [collectionid, plantid])

  const getCollectionPlantHandler = () => {
    const getCollectionPlant = CollectionPlantService.getOne(plantid)
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          console.log(data);
          setCollectionPlant(data);
        } else {
          // console.log(res.error.error)
        }
      }).catch(err => console.log(err))
    return getCollectionPlant;
  }

  const updateCollectionPlantHandler = (collectionPlant) => {
    const updateCollectionPlant = CollectionPlantService.updateCollectionPlant(collectionPlant, plantid)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null};
        } else {
          return { ok: false, err: await res.text()};
        }
      }).catch(err => console.log(err));
    return updateCollectionPlant;
  }

  return (
    <CollectionPlantContext.Provider value={
      {
        collectionPlant,
        getCollectionPlantHandler,
        updateCollectionPlantHandler
      }
    }>
      <CollectionPlantPage/>
    </CollectionPlantContext.Provider>
  )
}

export default CollectionPlantContainer;