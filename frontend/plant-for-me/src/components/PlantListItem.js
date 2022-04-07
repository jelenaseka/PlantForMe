import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import React from "react"
import NavbarLink from "./NavbarLink";
import parseISO from 'date-fns/parseISO'
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

const PlantListItem = ({plant}) => {

  const displayBeginningOfContent = (content) => {
    return content.substring(0,50);
  }

  const convertISODate = (date) => {
    // return parseISO(date)
    
    console.log(parseISO("2022-04-07T10:18:05+02:00"))
    return format(parseISO(date), 'yyyy-MM-dd')
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