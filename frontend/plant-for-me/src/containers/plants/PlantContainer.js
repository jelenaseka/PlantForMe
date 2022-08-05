import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { PlantContext} from '../../context/plants/PlantContext'
import PlantPage from "../../pages/plants/PlantPage";
import { PlantService } from "../../services/plants/PlantService";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth/AuthService";

const PlantContainer = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null)
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser()

  useEffect(() => {
    getPlantHandler();
  }, [id])

  const getPlantHandler = () => {
    const getData = PlantService.getOne(id)
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => {setPlant(data)});
        } else {
          return navigate("/404");
        }
      })
      .catch(err => console.log(err))
    return getData;
  }

  const deletePlantHandler = () => {
    const deletePlant = PlantService.deletePlant(id)
      .then(async res => {
        if(res.ok) {
          await res.text();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      });
    return deletePlant;
  }

  return (
    <PlantContext.Provider value={{plant, deletePlantHandler, currentUser}}>
      <PlantPage/>
    </PlantContext.Provider>
  )
}

export default PlantContainer