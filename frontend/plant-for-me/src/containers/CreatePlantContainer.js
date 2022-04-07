import React, { useEffect, useState } from 'react';
import { CreatePlantContext} from '../context/CreatePlantContext'
import CreatePlantPage from '../pages/CreatePlantPage';
import { CategoryService } from '../services/CategoryService';
import { PlantService } from '../services/PlantService';

const CreatePlantContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        setCategories(await CategoryService.getCategories())
      } catch(err) { console.log(err) }
    }
    getData()
  }, [])

  const createPlantHandler = (plant) => {
    
    const createPlant = PlantService.createPlant(plant)
      .then(response => response.text())
      .then(data => {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(data.startsWith("\"")) {
          data = data.slice(1, -2)
        }
        
        if(regexExp.test(data)) {
          console.log('usao')
          return { ok: true, err: null}
          
        } else {
          return { ok: false, err: data}
        }

    }).catch(err => {
      console.log('err: ',err)
    })

    return createPlant;
    
  }

  return (
    <CreatePlantContext.Provider value={{categories, createPlantHandler}}>
      <CreatePlantPage />
    </CreatePlantContext.Provider>
  )
}

export default CreatePlantContainer