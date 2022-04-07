import React, { useEffect, useState } from 'react';
import { PlantsContext} from '../context/PlantsContext'
import PlantsPage from '../pages/PlantsPage';
import { CategoryService } from '../services/CategoryService';
import { PlantService } from '../services/PlantService';

const PlantsContainer = () => {
  const [plants, setPlants] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        setPlants(await PlantService.getPlants())
        setCategories(await CategoryService.getCategories())
      } catch(err) { console.log(err) }
    }
    getData()
  }, [])

  const handleGetAll = (url) => {
    const getData = async () => {
      try {
        setPlants(await PlantService.getPlants(url))
      } catch(err) { console.log(err) }
    }
    getData()
  }

  return (
    <PlantsContext.Provider value={{plants, categories, handleGetAll}}>
      <PlantsPage />
    </PlantsContext.Provider>
  )
}

export default PlantsContainer