import React, { useEffect, useState } from 'react';
import { PlantsContext} from '../../context/plants/PlantsContext'
import PlantsPage from '../../pages/plants/PlantsPage';
import { CategoryService } from '../../services/plants/CategoryService';
import { PlantService } from '../../services/plants/PlantService';

const PlantsContainer = () => {
  const [plants, setPlants] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategoriesHandler()
    getPlantsHandler()
  }, [])

  const getCategoriesHandler = () => {
    const getData = CategoryService.getCategories()
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          setCategories(data)
        } else {
          //todo error
          const err = await res.text();
          return {ok: false, err: err};
        }
      })
      .catch(err => console.log(err) )
    return getData;
  }

  const getPlantsHandler = (url) => {
    const getData =  PlantService.getPlants(url)
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          setPlants(data)
        } else {
          //todo error
          const err = await res.text();
          return {ok: false, err: err};
        }
      })
      .catch(err => console.log(err) )
    return getData;
  }

  return (
    <PlantsContext.Provider value={
      {
        plants, 
        categories, 
        getPlantsHandler, 
        getCategoriesHandler
        }
      }>
      <PlantsPage />
    </PlantsContext.Provider>
  )
}

export default PlantsContainer