import { Alert, Button, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Box } from "@mui/system"
import React, { useContext, useState } from "react"
import { CategoriesContext } from "../../context/plants/CategoriesContext"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveCategoryDialog from "../../components/SaveCategoryDialog";
import AreYouSureDialog from "../../components/AreYouSureDialog";

const CategoriesPage = () => {
  const categoriesContext = useContext(CategoriesContext)
  const [createCategoryDialog, setCreateCategoryDialogOpen] = useState(false)
  const [updateCategoryDialog, setUpdateCategoryDialogOpen] = useState(false)
  const [deleteCategoryDialog, setDeleteCategoryDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState("success")
  const [errorMsg, setErrorMsg] = useState("Successfully added category!")
  const [selectedCategory, setSelectedCategory] = useState({})

  const createCategory = (name) => {
    validate(name) //nije dobro
    
    categoriesContext.createCategoryHandler({name: name.trim()}).then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully added category!")
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
      setCreateCategoryDialogOpen(false);
    }).then(() => categoriesContext.getAllHandler())
  }

  const updateCategory = (name, category) => {
    validate(name) //nije dobro
    
    var categoryToUpdate = JSON.parse(JSON.stringify(category));
    categoryToUpdate.name = name.trim()
    
    categoriesContext.updateCategoryHandler(categoryToUpdate)
    .then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully updated category!")
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
      setUpdateCategoryDialogOpen(false);
    }).then(() => categoriesContext.getAllHandler())
    
  }

  const deleteCategory = (categoryID) => {
    var isDeleted = categoriesContext.deleteCategoryHandler(categoryID)
    if(isDeleted) {
      setupAlert("success", "Successfully deleted category!")
    } else {
      setupAlert("error", "Error when deleting category")
    }
    setDeleteCategoryDialogOpen(false)
    setAlertOpen(true);
  }

  const validate = (name) => {
    if(name.trim() === "") {
      setupAlert("warning", "Name should not be empty!")
      setAlertOpen(true);
      return
    }
  }

  const handleClickDelete = (category) => {
    setSelectedCategory(category)
    setDeleteCategoryDialogOpen(true)
  }

  const handleClickUpdate = (category) => {
    setSelectedCategory(category)
    setUpdateCategoryDialogOpen(true)
  }

  const setupAlert = (severity, msg) => {
    setSeverity(severity);
    setErrorMsg(msg);
  }

  return (
    <div>
      <Box sx={{padding:'5em'}}>
        <Snackbar open={alertOpen} autoHideDuration={4000} onClose={() => setAlertOpen(false)}>
          <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
            {errorMsg}
          </Alert>
        </Snackbar>
        <Box sx={{ justifyContent: 'flex-end', marginBottom:'1em' }}>
          <Button variant="contained" onClick={() => setCreateCategoryDialogOpen(true)}>Add category</Button>
        </Box>

        <AreYouSureDialog handleOpen={deleteCategoryDialog} 
                  handleClose={() => setDeleteCategoryDialogOpen(false)} 
                  handleOperation={() => deleteCategory(selectedCategory.id)}
                  title="Delete category" content={"Are you sure you want to delete category " + selectedCategory.name + "?"}/>
        <SaveCategoryDialog title="Create new category" handleOpen={createCategoryDialog} handleClose={() => setCreateCategoryDialogOpen(false)}
        handleSaveCategory={(name) => createCategory(name)}/>

        <SaveCategoryDialog title="Edit category" handleOpen={updateCategoryDialog} handleClose={() => setUpdateCategoryDialogOpen(false)}
        handleSaveCategory={(name) => updateCategory(name, selectedCategory)}/>
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