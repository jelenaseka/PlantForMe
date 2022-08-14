import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import CollectionPage from "../../pages/plantcare/CollectionPage";
import { CollectionService } from "../../services/plantcare/CollectionService";
import { CollectionPlantService } from "../../services/plantcare/CollectionPlantService";
import { TaskService } from "../../services/plantcare/TaskService";

const CollectionContainer = () => {
  const [collection, setCollection] = useState({})
  const [collectionPlants, setCollectionPlants] = useState([])
  const [allPlants, setAllPlants] = useState([])
  const { id } = useParams();
  let navigate = useNavigate();


  useEffect(() => {
    getCollectionHandler();
    getCollectionPlantsHandler();

    setAllPlants([
      {
        id: "e5be6177-1f6d-4ed7-a202-4828c57d499c",
        name: "Dracaena",
        image: null
      },
    ])
  }, [id])

  const getCollectionPlantsHandler = () => {
    const getCollectionPlants = CollectionPlantService.getAllByCollectionId(id)
      .then(async res => {
        if(res.ok) {
          const data = await res.json()
          console.log(data)
          setCollectionPlants(data)
        } else {
          //
        }
      }).catch(err => console.log(err))
    
    return getCollectionPlants;
  }

  const getCollectionHandler = () => {
    const getCollection = CollectionService.getCollection(id)
      .then(async res => {
        if(res.ok) {
          const data = await res.json()
          console.log(data)
          setCollection(data)
        } else {
          //ovde treba 204 status
          console.log(res)
        }
      }).catch(err => console.log(err))

    return getCollection;
  }

  const addCollectionPlantHandler = (collectionPlant) => {
    collectionPlant.collectionId = id;
    const addCollectionPlant = CollectionPlantService.createCollectionPlant(collectionPlant)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text();
          return {ok:false, err: data}
        }
      }).catch(err => console.log(err));

    return addCollectionPlant;
  }

  const deleteCollectionPlantHandler = (id) => {
    const deleteCollectionPlant = CollectionPlantService.deleteCollectionPlant(id)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text()
          return { ok: false, err: data}
        }
      }).catch(err => console.log(err))
    return deleteCollectionPlant;
  }

  const addTaskHandler = (task) => {
    const addTask = TaskService.createTask(task)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text()
          return { ok: false, err: data}
        }
      }).catch(err => console.log(err));

    return addTask;
  }

  const setTaskToDoneHandler = (id) => {
    const setTaskToDone = TaskService.setTaskToDone(id)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text();
          return { ok: false, err: data}
        }
      }).catch(err => console.log(err));

      return setTaskToDone;
  }

  const deleteTaskHandler = (id) => {
    const deleteTask = TaskService.deleteTask(id)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null}
        } else {
          const data = await res.text();
          return { ok: false, err: data}
        }
      }).catch(err => console.log(err));

      return deleteTask;
  }

  return (
    <CollectionContext.Provider value={
      {
        collection, 
        allPlants, 
        addTaskHandler, 
        collectionPlants, 
        getCollectionPlantsHandler, 
        addCollectionPlantHandler,
        deleteCollectionPlantHandler,
        setTaskToDoneHandler,
        deleteTaskHandler
      }}>
      <CollectionPage/>
    </CollectionContext.Provider>
  )
}

export default CollectionContainer;