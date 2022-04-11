import React, { useContext, useEffect, useState } from "react"
import { CreatePlantContext } from "../context/CreatePlantContext";
import '../assets/css/layout.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PlantEditPanel from "../components/PlantEditPanel";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreatePlantPage = () => {
  const createPlantContext = useContext(CreatePlantContext)
  const [severity, setSeverity] = useState("success")
  const [alertMsg, setAlertMsg] = useState("")
  const [alertOpen, setAlertOpen] = useState(false);
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    reset()
  }, [])

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

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
    console.log(plant)
    if(plant === null) {
      setupAlert("error", "All fields required")
      setAlertOpen(true);
    }
    
    createPlantContext.createPlantHandler(plant).then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully created plant!")
        reset()
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
    })
  }

  const setupAlert = (severity, msg) => {
    setSeverity(severity);
    setAlertMsg(msg);
  }

  return (
    <div>
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <PlantEditPanel plant={plant}
      categories={createPlantContext.categories}
      handlePlantOperation={(plant) => createNewPlant(plant)}
      title="Create a plant"/>
    </div>
  )
}

export default CreatePlantPage