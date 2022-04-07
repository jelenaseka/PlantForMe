import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import React from "react"
import NavbarLink from "./NavbarLink";

const PlantListItem = ({plant}) => {

  const displayBeginningOfContent = (content) => {
    return content.substring(0,50);
  }

  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={plant.name}
        subheader={plant.createdAt}
      />
      <CardMedia
        component="img"
        height="194"
        image={plant.image}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {displayBeginningOfContent(plant.description)}...
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button variant="contained" >
          <NavbarLink link={"/plants/" + plant.id} title="See more" />
        </Button>
        
      </CardActions>
      
    </Card>
    </div>
  )
}

export default PlantListItem