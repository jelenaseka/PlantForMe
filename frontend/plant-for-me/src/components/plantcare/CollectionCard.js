import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Link, Typography } from "@mui/material";
import { amber, blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@mui/material/colors";
import { NavLink } from "react-router-dom";

const CollectionCard = ({collection}) => {
  const colorHue = 200;
    
  const randomColor = () => {
    const colors = [red[colorHue], pink[colorHue], purple[colorHue], deepPurple[colorHue], indigo[colorHue], blue[colorHue],
    lightBlue[colorHue], cyan[colorHue], teal[colorHue], green[colorHue], lightGreen[colorHue], lime[colorHue],
    yellow[colorHue], amber[colorHue], orange[colorHue], deepOrange[colorHue], brown[colorHue]];

    var rand_index = Math.floor(Math.random() * colors.length);
    return colors[rand_index];
  }

  return (
    <Card>
      {
        collection.image ?
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
        : 
        <CardMedia
          sx={{height:'140px', bgcolor:randomColor()}}
        />
      }
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {collection.heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {collection.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={NavLink} to={`/plantcare/${collection.id}`}>See collection</Button>
      </CardActions>
    </Card>
  )
}

export default CollectionCard;