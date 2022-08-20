import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionPlantContext } from "../../context/plantcare/CollectionPlantContext";
import CollectionPlantPage from "../../pages/plantcare/CollectionPlantPage";
import { AuthService } from "../../services/auth/AuthService";
import { CollectionPlantService } from "../../services/plantcare/CollectionPlantService";
import { tokenIsExpired } from "../../utils/functions/jwt";

const CollectionPlantContainer = () => {
  const { collectionid, plantid } = useParams();
  const [ collectionPlant, setCollectionPlant ] = useState({})
  const currentUser = AuthService.getCurrentUser();
  let navigate = useNavigate();

  useEffect(() => {
    if(tokenIsExpired()) {
      AuthService.logout();
      return navigate("/login");
    }
    getCollectionPlantHandler()
  }, [collectionid, plantid])

  const getCollectionPlantHandler = () => {
    const getCollectionPlant = CollectionPlantService.getOne(plantid)
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          if(data.collection.username !== currentUser.username) {
            return navigate("/404");
          }
          setCollectionPlant(data);
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