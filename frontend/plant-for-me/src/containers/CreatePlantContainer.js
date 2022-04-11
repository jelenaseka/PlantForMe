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
      .then(async res => {
        if(res.status === 409) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          await res.text();
          return { ok: true, err: null };
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