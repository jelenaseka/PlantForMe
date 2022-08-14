import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext, useState } from "react"
import { CategoriesContext } from "../../context/plants/CategoriesContext"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveCategoryDialog from "../../components/plants/SaveCategoryDialog";
import AreYouSureDialog from "../../utils/components/AreYouSureDialog";
import { ToastContainer, toast } from 'react-toastify';
import { tokenIsExpired } from "../../utils/functions/jwt";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth/AuthService";

const CategoriesPage = () => {
  const categoriesContext = useContext(CategoriesContext)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteCategoryDialog, setDeleteCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({name: 'ha'});
  let navigate = useNavigate();

  const handleFeedback = (feedback) => {
    if (feedback.ok) {
      toast.success(feedback.message);
      setCategoryDialogOpen(false);
      categoriesContext.getCategoriesHandler();
    } else {
      toast.error(feedback.message);
    }
  }

  const deleteCategory = (categoryID) => {
    if(tokenIsExpired() || categoriesContext.currentUser === null) {
      AuthService.logout();
      return navigate("/login");
    }
    categoriesContext.deleteCategoryHandler(categoryID).then(res => {
      if(res.ok) {
        toast.success("Successfully deleted category!");
        setDeleteCategoryDialogOpen(false);
        categoriesContext.getCategoriesHandler();
      } else {
        toast.error(res.err);
      }
    })
  }

  const handleClickCreate = () => {
    setSelectedCategory({name:""})
    setCategoryDialogOpen(true)
  }

  const handleClickDelete = (category) => {
    setSelectedCategory(category)
    setDeleteCategoryDialogOpen(true)
  }

  const handleClickUpdate = (category) => {
    setSelectedCategory(category)
    setCategoryDialogOpen(true)
  }

  return (
    <div>
      <ToastContainer />
      <Box sx={{padding:'5em'}}>
        <Box sx={{ justifyContent: 'flex-end', marginBottom:'1em' }}>
          <Button variant="contained" onClick={() => handleClickCreate()}>Add category</Button>
        </Box>

        <AreYouSureDialog handleOpen={deleteCategoryDialog} 
                  handleClose={() => setDeleteCategoryDialogOpen(false)} 
                  handleOperation={() => deleteCategory(selectedCategory.id)}
                  title="Delete category" content={"Are you sure you want to delete category " + selectedCategory.name + "?"}/>

        <SaveCategoryDialog
          category={selectedCategory}
          title="Edit category" 
          handleOpen={categoryDialogOpen} 
          handleClose={() => setCategoryDialogOpen(false)}
          handleFeedback={(category) => handleFeedback(category)}/>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriesContext.categories.map((category) => (
                <TableRow
                  key={category.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  <TableCell style={{ width: 60 }} align="right" onClick={() => handleClickUpdate(category)}><EditIcon/></TableCell>
                  <TableCell style={{ width: 60 }} align="right" onClick={() => handleClickDelete(category)}><DeleteIcon/></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  )
}

export default CategoriesPage