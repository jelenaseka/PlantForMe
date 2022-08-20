import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreatePlantContext} from '../../context/plants/CreatePlantContext'
import CreatePlantPage from '../../pages/plants/CreatePlantPage';
import { AuthService } from '../../services/auth/AuthService';
import { CategoryService } from '../../services/plants/CategoryService';
import { PlantService } from '../../services/plants/PlantService';
import { tokenIsExpired } from '../../utils/functions/jwt';

const CreatePlantContainer = () => {
  const [categories, setCategories] = useState([])
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if(tokenIsExpired() || currentUser === null) {
      AuthService.logout();
      navigate("/login");
    }
    if(currentUser.role === 0) {
      navigate("/404");
    }
    getCategoriesHandler();
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
      .catch(err => console.log(err))
    return getData;
  }

  const createPlantHandler = (plant) => {
    const createPlant = PlantService.createPlant(plant)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => console.log('err: ',err));

    return createPlant;
  }

  return (
    <CreatePlantContext.Provider value={{categories, createPlantHandler, currentUser}}>
      <CreatePlantPage />
    </CreatePlantContext.Provider>
  )
}

export default CreatePlantContainer