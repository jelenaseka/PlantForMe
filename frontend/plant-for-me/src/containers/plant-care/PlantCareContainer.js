import React, { useEffect, useState } from "react";
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