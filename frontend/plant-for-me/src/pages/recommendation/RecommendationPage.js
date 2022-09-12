import { Box, Typography } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { RecommendationContext } from "../../context/recommendation/RecommendationContext";
import PlantListItem from "../../components/plants/PlantListItem"
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

const RecommendationPage = () => {
  const context = useContext(RecommendationContext)

  return (
    <Box>
      <Typography variant="h1" component="div" gutterBottom sx={{fontSize:'30px', padding:'2em 2em 0 2em'}}>
        Recommendation for you
      </Typography>
      <Box sx={{padding:'2em'}}>
        {
          context.currentUser ?
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={2} >
              {context.recommendations.map((plant, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <PlantListItem plant={plant}></PlantListItem>
                </Grid>
              ))}
            </Grid>
          :
          <Box sx={{paddingLeft:'2em'}}><Link to="/login">Log in</Link> to see a recommendation</Box>
        }
      </Box>
      
    </Box>
  )
}

export default RecommendationPage;