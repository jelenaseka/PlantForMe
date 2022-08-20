import React, { useContext,  } from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { amber, blue, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@mui/material/colors";
import { NavLink } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { PlantCareContext } from "../../context/plantcare/PlantCareContext";

const CollectionCard = ({collection}) => {
  const plantCareContext = useContext(PlantCareContext);
  const colorHue = 200;
    
  const randomColor = () => {
    const colors = [red[colorHue], pink[colorHue], purple[colorHue], deepPurple[colorHue], indigo[colorHue], blue[colorHue],
    lightBlue[colorHue], cyan[colorHue], teal[colorHue], green[colorHue], lightGreen[colorHue], lime[colorHue],
    yellow[colorHue], amber[colorHue], orange[colorHue], deepOrange[colorHue], brown[colorHue]];

    var rand_index = Math.floor(Math.random() * colors.length);
    return colors[rand_index];
  }

  const deleteCollection = () => {
    plantCareContext.deleteCollectionHandler(collection.id)
    .then(res => {
      if(res.ok) {
        toast.success("Successfully deleted collection!");
        plantCareContext.getMyCollectionsHandler();
      } else {
        toast.error(res.err)
      }
    })
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
        ><div></div></CardMedia>
      }
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {collection.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {collection.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={NavLink} to={`/plantcare/${collection.id}`}>See collection</Button>
        <Button size="small" onClick={() => deleteCollection()}><DeleteIcon/></Button>
      </CardActions>
    </Card>
  )
}

export default CollectionCard;