import React, { useEffect, useState } from 'react';
import { PlantsContext} from '../../context/plants/PlantsContext'
import PlantsPage from '../../pages/plants/PlantsPage';
import { CategoryService } from '../../services/plants/CategoryService';
import { PlantService } from '../../services/plants/PlantService';

const PlantsContainer = () => {
  const [plants, setPlants] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    handleGetAll()
  }, [])

  const handleGetPlants = (url) => {
    const getData = async () => {
      try {
        const plantResponse = await PlantService.getPlants(url)
        if(!plantResponse.ok) {
          const err = await plantResponse.text();
          return {ok: false, err: err};
        } else {
          const data = await plantResponse.json();
          setPlants(data)
        }
        
      } catch(err) { console.log(err) }
    }
    getData();
  }

  const handleGetAll = () => {
    const getData = async () => {
      try {
        const plantResponse = await PlantService.getPlants()
        if(!plantResponse.ok) {
          const err = await plantResponse.text();
          console.log(err)
          return {ok: false, err: err};
        } else {
          const data = await plantResponse.json();
          console.log(data)
          setPlants(data)
        }
        
        const categoriesResponse = await CategoryService.getCategories()
        if(!categoriesResponse.ok) {
          const err = await categoriesResponse.text();
          console.log(err)
          return {ok: false, err: err};
        } else {
          const data = await categoriesResponse.json();
          setCategories(data)
        }
      } catch(err) { console.log(err) }
    }
    getData();
  }

  return (
    <PlantsContext.Provider value={{plants, categories, handleGetPlants}}>
      <PlantsPage />
    </PlantsContext.Provider>
  )
}

export default PlantsContainer