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
    console.log('kreiranje', plant)
    const createPlant = async () => {
      try {
        await PlantService.createPlant(plant)
      } catch(err) {console.log(err)}
    }
    createPlant()
    
    
  }

  return (
    <CreatePlantContext.Provider value={{categories, createPlantHandler}}>
      <CreatePlantPage />
    </CreatePlantContext.Provider>
  )
}

export default CreatePlantContainer