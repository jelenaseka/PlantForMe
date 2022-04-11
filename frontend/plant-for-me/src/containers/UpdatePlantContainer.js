import React, { useEffect, useState } from "react"
import { CategoryService } from "../services/CategoryService"
import { UpdatePlantContext} from '../context/UpdatePlantContext'
import UpdatePlantPage from '../pages/UpdatePlantPage';
import { PlantService } from '../services/PlantService';
import { useParams } from "react-router-dom";

const UpdatePlantContainer = () => {
  const [categories, setCategories] = useState([])
  const { id } = useParams();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setCategories(await CategoryService.getCategories())
        reset()
      } catch(err) { console.log(err) }
    }
    getData()
  }, [])

  const reset = async () => {
    
    PlantService.getOne(id)
      .then(async res => {
        if(res.status === 404) {
          return await res.text();
        } else {
          return await res.json().then(data => {
            var plant = data
            var bm = []; 
            plant.bloomingMonths.forEach(b => {
              bm.push(b.month)
            })
            setPlant({
              id: plant.id,
              name: plant.name,
              description: plant.description,
              image: plant.image,
              categoryID: "",
              light: plant.light,
              watering: plant.watering,
              isBlooming: plant.isBlooming,
              bloomingMonths: bm,
              growthRate: plant.growthRate,
              hardiness: plant.hardiness,
              height: plant.height,
              lifeTime: plant.lifeTime,
            })
          });
        }
      })
    
  }

  const updatePlantHandler = (plant) => {
    
    const updatePlant = PlantService.updatePlant(plant)
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

    return updatePlant;
    
  }

  return (
    <UpdatePlantContext.Provider value={{categories, plant, reset, updatePlantHandler}}>
      <UpdatePlantPage />
    </UpdatePlantContext.Provider>
  )
}

export default UpdatePlantContainer