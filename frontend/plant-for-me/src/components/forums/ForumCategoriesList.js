import React, { useContext, useState } from "react";
import { Button, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon,  Typography } from "@mui/material";
import { Box } from "@mui/system";
import GrassIcon from '@mui/icons-material/Grass';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { Link, NavLink } from "react-router-dom";
import { ForumsContext } from "../../context/forums/ForumsContext";
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AreYouSureDialog from "../../utils/components/AreYouSureDialog";
import EditIcon from '@mui/icons-material/Edit';
import CategoryDialog from "./CategoryDialog";

const ForumCategoriesList = ({categories}) => {
  const forumContext = useContext(ForumsContext)
  const [selectedCategoryId, setSelectedCategoryId] = React.useState("-1");
  const [selectedCategory, setSelectedCategory] = useState({name:''});
  
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [areYouSureDialogOpen, setAreYouSureDialogOpen] = useState(false);

  const addCategory = (category) => {
    forumContext.createCategoryHandler(category)
      .then(res => {
        if (res.ok) {
          setCategoryDialogOpen(false);
          toast.success("Successfully added category!");
          forumContext.getCategoriesHandler();
        } else {
          toast.error(res.err);
        }
      });
  }

  const editCategory = (category) => {
    forumContext.editCategoryHandler(category).then(res => {
      if(res.ok) {
        toast.success("Successfully edited category!")
        setEditCategoryDialogOpen(false);
        forumContext.getCategoriesHandler();
      } else {
        toast.error(res.err);
      }
    });
  }

  return (
    <Box sx={{ bgcolor: '#fff', marginTop:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
      <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
        Categories
      </Typography>
      <AreYouSureDialog handleOpen={areYouSureDialogOpen} 
                  handleClose={() => setAreYouSureDialogOpen(false)} 
                  handleOperation={() => forumContext.deleteCategoryHandler(selectedCategoryId)}
                  title="Delete category" content={"Are you sure you want to delete category?"}/>
      <CategoryDialog 
        open={editCategoryDialogOpen} 
        handleCancel={() => setEditCategoryDialogOpen(false)}
        handleSubmit={(category) => editCategory(category)}
        selectedCategory={selectedCategory}/>      
      {
        (forumContext.currentUser && (forumContext.currentUser.role === 2 || forumContext.currentUser.role === 1)) &&
        <div>
          <Button onClick={() => setCategoryDialogOpen(true)}><AddIcon/></Button>
          <CategoryDialog 
            open={categoryDialogOpen} 
            handleCancel={() => setCategoryDialogOpen(false)}
            handleSubmit={(category) => addCategory(category)}
            selectedCategory={{name:''}}/>
          
        </div>
        
      }
      <nav aria-label="main mailbox folders">
        <List sx={{padding:'0'}}>
          <ListItemButton 
            selected={selectedCategoryId === '-1'} 
            onClick={() => setSelectedCategoryId("-1")}>
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
                      selected={selectedCategoryId === category.id} 
                      onClick={() => setSelectedCategoryId(category.id)}>
                      <ListItemIcon>
                        <GrassIcon />
                      </ListItemIcon>
                      <Link component={NavLink}
                        to={`/forums?category=${category.name}`}
                      >{category.name}</Link>

                      </ListItemButton>
                  </Grid>
                  <Grid item md={2} sx={{paddingRight:'1em', textAlign:'right'}}>
                    {category.postsCount} posts
                  </Grid>
                  {
                    (forumContext.currentUser && (forumContext.currentUser.role === 2 || forumContext.currentUser.role === 1)) &&
                    <Grid item md={2}>
                      <Box sx={{diplay:'flex', flexDirection:'row'}}>
                        <Button>
                          <EditIcon onClick={() => {setSelectedCategory(category); return setEditCategoryDialogOpen(true)}}/>
                        </Button>
                        <Button>
                          <DeleteIcon onClick={() => {setSelectedCategoryId(category.id); return setAreYouSureDialogOpen(true)}}/>
                        </Button>
                      </Box>
                    </Grid>
                  }
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