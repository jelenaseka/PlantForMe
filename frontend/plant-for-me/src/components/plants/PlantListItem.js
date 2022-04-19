import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import React from "react"
import { NavLink } from "react-router-dom";

const PlantListItem = ({plant}) => {

  const displayBeginningOfContent = (content) => {
    return content.substring(0,50);
  }

  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader title={plant.name} />
        <CardMedia component="img" height="194" image={plant.image} alt="Paella dish" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {displayBeginningOfContent(plant.description)}...
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button>
            <NavLink to={"/plants/" + plant.id} className="plant-list-item-button">
              See more
            </NavLink>
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default PlantListItem