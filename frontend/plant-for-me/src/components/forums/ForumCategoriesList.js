import React, { useContext, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GrassIcon from '@mui/icons-material/Grass';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { Link, Navigate, NavLink } from "react-router-dom";
import { ForumsContext } from "../../context/forums/ForumsContext";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AreYouSureDialog from "../../utils/components/AreYouSureDialog";
import EditIcon from '@mui/icons-material/Edit';

const ForumCategoriesList = ({categories}) => {
  const forumContext = useContext(ForumsContext)
  const [selectedCategory, setSelectedCategory] = React.useState("-1");
  const handleListItemClick = (event, categoryId) => {
    setSelectedCategory(categoryId);
  };
  const [newCategory, setNewCategory] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [areYouSureDialogOpen, setAreYouSureDialogOpen] = useState(false);

  const addCategory = () => {
    if (newCategory === "") {
      toast.error("not valid");
      return;
    }
    forumContext.createCategoryHandler({name: newCategory})
      .then(res => {
        if (res.ok) {
          setNewCategory("");
          setCategoryDialogOpen(false);
          toast.success("Successfully added category!");
          forumContext.getCategoriesHandler();
        } else {
          toast.error(res.err);
        }
      })
  }

  const editCategory = () => {
    if (selectedCategory.name.trim() === "") {
      toast.error("not valid");
      return;
    }
    forumContext.editCategoryHandler(selectedCategory, selectedCategory.id);
    setEditCategoryDialogOpen(false);
  }

  return (
    <Box sx={{ bgcolor: '#fff', marginTop:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
      <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
        Categories
      </Typography>
      <AreYouSureDialog handleOpen={areYouSureDialogOpen} 
                  handleClose={() => setAreYouSureDialogOpen(false)} 
                  handleOperation={() => forumContext.deleteCategoryHandler(selectedCategory.id)}
                  title="Delete category" content={"Are you sure you want to delete category?"}/>
      <Dialog open={editCategoryDialogOpen} onClose={() => setEditCategoryDialogOpen(false)}>
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category name"
            type="text"
            fullWidth
            
            variant="standard"
            value={selectedCategory.name}
            onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})} 
            onBlur={() => setSelectedCategory({...selectedCategory, name: selectedCategory.name.trim()})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCategoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => editCategory()}>Submit</Button>
        </DialogActions>
      </Dialog>            
      <ToastContainer />
      {
        forumContext.currentUser && forumContext.currentUser.role === 2 &&
        <div>
          <Button onClick={() => setCategoryDialogOpen(true)}><AddIcon/></Button>
          <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)}>
            <DialogTitle>Add category</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Category name"
                type="text"
                fullWidth
                
                variant="standard"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)} 
                onBlur={() => setNewCategory(newCategory.trim())} 
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => addCategory()}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
        
      }
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
                        to={`/forums?category=${category.name}`}
                      >{category.name}</Link>

                      </ListItemButton>
                  </Grid>
                  <Grid item md={2} sx={{paddingRight:'1em', textAlign:'right'}}>
                    {category.postsCount} posts
                  </Grid>
                  {
                    forumContext.currentUser && forumContext.currentUser.role === 2 &&
                    <Grid item md={2}>
                      <Box sx={{diplay:'flex', flexDirection:'row'}}>
                        <Button>
                          <EditIcon onClick={() => {setSelectedCategory(category); return setEditCategoryDialogOpen(true)}}/>
                        </Button>
                        <Button>
                          <DeleteIcon onClick={() => {setSelectedCategory(category); return setAreYouSureDialogOpen(true)}}/>
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