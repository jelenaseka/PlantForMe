import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import CollectionPage from "../../pages/plantcare/CollectionPage";
import { CollectionService } from "../../services/plantcare/CollectionService";
import { CollectionPlantService } from "../../services/plantcare/CollectionPlantService";
import { TaskService } from "../../services/plantcare/TaskService";
import { PlantService } from "../../services/plants/PlantService";
import { AuthService } from "../../services/auth/AuthService";
import { tokenIsExpired } from "../../utils/functions/jwt";

const CollectionContainer = () => {
  const [collection, setCollection] = useState({})
  const [collectionPlants, setCollectionPlants] = useState([])
  const [allPlants, setAllPlants] = useState([])
  const { id } = useParams();
  const currentUser = AuthService.getCurrentUser();
  let navigate = useNavigate();

  useEffect(() => {
    if(tokenIsExpired()) {
      AuthService.logout();
      return navigate("/login");
    }
    getCollectionHandler();
    getCollectionPlantsHandler();
    getAllPlantReferencesHandler();

  }, [id]);

  const getAllPlantReferencesHandler = () => {
    const getAllPlantReferences = PlantService.getPlantReferences()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => {console.log('all:',data);setAllPlants(data)});
        }
      }).catch(err => console.log(err));
    return getAllPlantReferences;
  }

  const getCollectionPlantsHandler = () => {
    const getCollectionPlants = CollectionPlantService.getAllByCollectionId(id)
      .then(async res => {
        if(res.ok) {
          const data = await res.json()
          setCollectionPlants(data)
        }
      }).catch(err => console.log(err))
    
    return getCollectionPlants;
  }

  const getCollectionHandler = () => {
    const getCollection = CollectionService.getCollection(id)
      .then(async res => {
        if(res.ok) {
          const data = await res.json()
          if(data.username !== currentUser.username) {
            return navigate("/404");
          }
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