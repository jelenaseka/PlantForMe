import { Button, Grid } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import FilterPanel from "../../components/plants/FilterPanel"
import PlantListItem from "../../components/plants/PlantListItem"
import { PlantsContext } from "../../context/plants/PlantsContext"

const PlantsPage = () => {
  const plantContext = useContext(PlantsContext)

  return (
    <div> {
      plantContext.plants && 
      <Box sx={{ flexGrow: 1, padding: '2em' }}>
        <Grid container>
          <Grid item md={3}>
            <FilterPanel/>
          </Grid>
          <Grid item md={9}>
            <Box>
              <Button>
                <NavLink to="/plants/create">
                  Create plant
                </NavLink>
              </Button>
            </Box>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {plantContext.plants.map((plant, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <PlantListItem plant={plant}></PlantListItem>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      }
      
    </div>
  )
}

export default PlantsPage