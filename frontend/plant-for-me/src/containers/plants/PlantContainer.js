import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { PlantContext} from '../../context/plants/PlantContext'
import PlantPage from "../../pages/plants/PlantPage";
import { PlantService } from "../../services/plants/PlantService";
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
    
    const deletePlant = PlantService.deletePlant(id)
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          await res.text();
          return { ok: true, err: null };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      });
    return deletePlant;
  }

  return (
    <PlantContext.Provider value={{plant, deletePlantHandler}}>
      <PlantPage/>
    </PlantContext.Provider>
  )
}

export default PlantContainer