import React, { useEffect, useState } from "react"
import { CategoryService } from "../../services/plants/CategoryService"
import { UpdatePlantContext} from '../../context/plants/UpdatePlantContext'
import UpdatePlantPage from '../../pages/plants/UpdatePlantPage';
import { PlantService } from '../../services/plants/PlantService';
import { useNavigate, useParams } from "react-router-dom";

const UpdatePlantContainer = () => {
  const [categories, setCategories] = useState([])
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    getCategoriesHandler()
    getPlantHandler()
  }, [id])

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

  const getPlantHandler = () => {
    const getData = PlantService.getOne(id)
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setPlant(data));
        } else {
          return navigate("/404");
        }
      })
      .catch(err => console.log(err))
    return getData;
  }

  const updatePlantHandler = (plant) => {
    const updatePlant = PlantService.updatePlant(plant)
      .then(async res => {
        if(res.ok) {
          getPlantHandler();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })

  return updatePlant;
  }

  return (
    <UpdatePlantContext.Provider value={
      {
        categories, 
        plant,
        updatePlantHandler}}>
      <UpdatePlantPage />
    </UpdatePlantContext.Provider>
  )
}

export default UpdatePlantContainer