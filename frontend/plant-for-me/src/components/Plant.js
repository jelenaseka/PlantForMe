import { Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material"
import React from "react"
import ShareIcon from '@mui/icons-material/Share';

const Plant = ({plant}) => {
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={plant.name}
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        height="194"
        image={plant.image}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        
      </CardActions>
      
    </Card>
    </div>
  )
}

export default Plant