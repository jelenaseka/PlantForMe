import React, { useEffect, useState } from 'react';
import { PlantsContext} from '../context/PlantsContext'
import PlantsPage from '../pages/PlantsPage';
import { PlantService } from '../services/PlantService';

const PlantsContainer = () => {
  const [plants, setPlants] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        setPlants(await PlantService.getPlants())
      } catch(err) { console.log(err) }
    }
    getData()
  }, [])


  return (
    <PlantsContext.Provider value={{plants}}>
      <PlantsPage />
    </PlantsContext.Provider>
  )
}

export default PlantsContainer