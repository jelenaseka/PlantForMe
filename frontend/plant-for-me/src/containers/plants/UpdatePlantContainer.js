import React, { useEffect, useState } from "react"
import { CategoryService } from "../../services/plants/CategoryService"
import { UpdatePlantContext} from '../../context/plants/UpdatePlantContext'
import UpdatePlantPage from '../../pages/plants/UpdatePlantPage';
import { PlantService } from '../../services/plants/PlantService';
import { useNavigate, useParams } from "react-router-dom";
import { tokenIsExpired } from "../../utils/functions/jwt";
import { AuthService } from "../../services/auth/AuthService";

const UpdatePlantContainer = () => {
  const [categories, setCategories] = useState([])
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if(tokenIsExpired() || currentUser === null || currentUser.role !== 1) {
      AuthService.logout();
      navigate("/login");
    }
    getCategoriesHandler()
    getPlantHandler()
  }, [id])

  const getCategoriesHandler = () => {
    const getData = CategoryService.getCategories()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setCategories(data));
        } else {
          return await res.text().then(data => console.log(data));
        }
      })
      .catch(err => console.log(err))
    return getData;
  }

  const getPlantHandler = () => {
    const getData = PlantService.getOne(id)
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setPlant(data));
        } else {
          if(res.status === 204) {
            return navigate("/404");
          }
        }
      })
      .catch(err => console.log(err))
    return getData;
  }

  const updatePlantHandler = (plant) => {
    const updatePlant = PlantService.updatePlant(plant)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      });

    return updatePlant;
  }

  return (
    <UpdatePlantContext.Provider value={
      {
        categories, 
        plant,
        updatePlantHandler,
        getPlantHandler,
        currentUser
      }
    }>
      <UpdatePlantPage />
    </UpdatePlantContext.Provider>
  )
}

export default UpdatePlantContainer