import { Grid } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext } from "react"
import Plant from "../components/Plant"
import { PlantsContext } from "../context/PlantsContext"
const PlantsPage = () => {
  const plantContext = useContext(PlantsContext)

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {plantContext.plants.map((plant, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Plant plant={plant}></Plant>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default PlantsPage