import { Snackbar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react"
import PlantEditPanel from "../../components/PlantEditPanel";
import { UpdatePlantContext } from "../../context/plants/UpdatePlantContext";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UpdatePlantPage = () => {
  const updatePlantContext = useContext(UpdatePlantContext)
  const [severity, setSeverity] = useState("success")
  const [alertMsg, setAlertMsg] = useState("")
  const [alertOpen, setAlertOpen] = useState(false);
  const [plant, setPlant] = useState(false)

  useEffect(() => {
    setPlant(updatePlantContext.plant)
  }, [updatePlantContext.plant])

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const updatePlant = (plantToUpdate) => {
    console.log('',plantToUpdate)
    if(plantToUpdate === null) {
      setupAlert("error", "All fields required")
      setAlertOpen(true);
      updatePlantContext.reset()
      return;
    }
    
    updatePlantContext.updatePlantHandler(plantToUpdate).then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully updated plant!")
        updatePlantContext.reset()
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
      {
        plant &&
        <div>
          <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
              {alertMsg}
            </Alert>
          </Snackbar>
          <PlantEditPanel plant={plant}
          categories={updatePlantContext.categories}
          handlePlantOperation={(plant) => updatePlant(plant)}
          title={"Update plant - " + plant.name}/>
        </div>
      }
      
    </div>
  )
}

export default UpdatePlantPage