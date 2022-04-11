import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { PlantContext} from '../context/PlantContext'
import PlantPage from "../pages/PlantPage";
import { PlantService } from "../services/PlantService";
import { useNavigate } from "react-router-dom";

const PlantContainer = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null)
  let navigate = useNavigate();

  useEffect(() => {
    PlantService.getOne(id)
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          return navigate("/404");
        } else {
          return await res.json().then(data => setPlant(data));
        }
      })
    
  }, [id])

  const deletePlantHandler = () => {
    console.log(id)
    PlantService.deletePlant(id)
      .then(() => {
        return navigate("/plants");
      }).catch(err => {
        console.log('err: ',err)
      })

  }

  return (
    <PlantContext.Provider value={{plant, deletePlantHandler}}>
      <PlantPage/>
    </PlantContext.Provider>
  )
}

export default PlantContainer