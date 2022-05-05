import React, { useEffect, useState } from 'react';
import { CreatePlantContext} from '../../context/plants/CreatePlantContext'
import CreatePlantPage from '../../pages/plants/CreatePlantPage';
import { CategoryService } from '../../services/plants/CategoryService';
import { PlantService } from '../../services/plants/PlantService';

const CreatePlantContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategoriesHandler()
  }, [])

  const getCategoriesHandler = () => {
    const getData = CategoryService.getCategories()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setCategories(data))
        } else {
          //todo error
        }
      })
      .catch(err => console.log(err))
    return getData;
  }

  const createPlantHandler = (plant) => {
    const createPlant = PlantService.createPlant(plant)
      .then(async res => {
        if(res.ok) {
          await res.text();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
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