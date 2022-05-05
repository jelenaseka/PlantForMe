import { Snackbar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react"
import PlantEditPanel from "../../components/plants/PlantEditPanel";
import { UpdatePlantContext } from "../../context/plants/UpdatePlantContext";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const UpdatePlantPage = () => {
  const updatePlantContext = useContext(UpdatePlantContext)
  const [plant, setPlant] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    setPlant(updatePlantContext.plant)
  }, [updatePlantContext.plant])

  const updatePlant = (plantToUpdate) => {
    updatePlantContext.updatePlantHandler(plantToUpdate).then(res => {
      if(res.ok) {
        toast.success("Successfully updated plant!");
      } else {
        toast.error(res.err);
      }
    })
  }

  const handleBack = () => {
    navigate(`/plants/${updatePlantContext.plant.id}`);
  }

  return (
    <div>
      {
        plant &&
        <div>
          <ToastContainer />
          <PlantEditPanel 
            plant={plant}
            categories={updatePlantContext.categories}
            handlePlantOperation={(plant) => updatePlant(plant)}
            title={"Update plant - " + plant.name}
            handleBack={handleBack}
          />
        </div>
      }
      
    </div>
  )
}

export default UpdatePlantPage