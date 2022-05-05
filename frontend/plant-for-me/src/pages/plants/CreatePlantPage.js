import React, { useContext, useEffect, useState } from "react"
import { CreatePlantContext } from "../../context/plants/CreatePlantContext";
import '../../assets/css/layout.css';
import Snackbar from '@mui/material/Snackbar';
import PlantEditPanel from "../../components/plants/PlantEditPanel";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const CreatePlantPage = () => {
  const createPlantContext = useContext(CreatePlantContext)
  const [plant, setPlant] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    reset()
  }, [])

  const handleBack = () => {
    navigate("/plants");
  }

  const reset = () => {
    setPlant({
      name: "",
      description: "",
      image: null,
      categoryID: "",
      light: 0,
      watering: 0,
      isBlooming: false,
      bloomingMonths: [],
      growthRate: 0,
      hardiness: 0,
      height: 0,
      lifeTime: 0,
    })
  }

  const createNewPlant = (plant) => {
    createPlantContext.createPlantHandler(plant).then(res => {
      if(res.ok) {
        reset();
        toast.success("Successfully added plant!");
      } else {
        toast.error(res.err);
      }
    })
  }

  return (
    <div>
      <ToastContainer />
      <PlantEditPanel 
        plant={plant}
        categories={createPlantContext.categories}
        handlePlantOperation={(plant) => createNewPlant(plant)}
        handleBack={handleBack}
        title="Create a plant"/>
    </div>
  )
}

export default CreatePlantPage