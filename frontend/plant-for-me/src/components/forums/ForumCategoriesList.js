import React from "react";
import { Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GrassIcon from '@mui/icons-material/Grass';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { Link, NavLink } from "react-router-dom";

const ForumCategoriesList = ({categories}) => {
  const [selectedCategory, setSelectedCategory] = React.useState("-1");
  const handleListItemClick = (event, categoryId) => {
    console.log(categoryId)
    setSelectedCategory(categoryId);
  };


  return (
    <Box sx={{ bgcolor: '#fff', margin:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
      <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
        Categories
      </Typography>
      <nav aria-label="main mailbox folders">
        <List sx={{padding:'0'}}>
          <ListItemButton 
            selected={selectedCategory === '-1'} 
            onClick={(event) => handleListItemClick(event, "-1")}>
            <ListItemIcon>
              <FormatListBulletedOutlinedIcon />
            </ListItemIcon>
            <Link component={NavLink}
                  to="/forums">All categories</Link>
          </ListItemButton>
          {
            categories.map((category, index) => (
              <div key={index}>
                <ListItem disablePadding>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item md={8}>
                    <ListItemButton 
                      selected={selectedCategory === category.id} 
                      onClick={(event) => handleListItemClick(event, category.id)}>
                      <ListItemIcon>
                        <GrassIcon />
                      </ListItemIcon>
                      <Link component={NavLink}
                        // to={getCurrentLink(forumContext.currentPage, category.name)}
                        to={`/forums?category=${category.name}`}
                      >{category.name}</Link>

                      </ListItemButton>
                  </Grid>
                  <Grid item md={4} sx={{paddingRight:'1em', textAlign:'right'}}>
                    {category.postsCount} posts
                  </Grid>
                </Grid>
                </ListItem>
                <Divider></Divider>
              </div>
            ))
          }
        </List>
      </nav>
    </Box>
  )
}

export default ForumCategoriesList;