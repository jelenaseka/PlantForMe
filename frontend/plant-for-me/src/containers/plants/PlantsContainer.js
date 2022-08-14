import React, { useEffect, useState } from 'react';
import { PlantsContext} from '../../context/plants/PlantsContext'
import PlantsPage from '../../pages/plants/PlantsPage';
import { CategoryService } from '../../services/plants/CategoryService';
import { PlantService } from '../../services/plants/PlantService';
import { AuthService } from '../../services/auth/AuthService';
import { tokenIsExpired } from '../../utils/functions/jwt';

const PlantsContainer = () => {
  const [plants, setPlants] = useState([])
  const [categories, setCategories] = useState([])
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if(tokenIsExpired()) {
      AuthService.logout();
    }
    getCategoriesHandler()
    getPlantsHandler()
  }, [])

  const getCategoriesHandler = () => {
    const getData = CategoryService.getCategories()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setCategories(data))
        } else {
          const err = await res.text();
          console.log(err);
        }
      })
      .catch(err => console.log(err) )
    return getData;
  }

  const getPlantsHandler = (url) => {
    const getData =  PlantService.getPlants(url)
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setPlants(data))
        } else {
          const err = await res.text();
          console.log(err);
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
        getCategoriesHandler,
        currentUser
        }
      }>
      <PlantsPage />
    </PlantsContext.Provider>
  )
}

export default PlantsContainer