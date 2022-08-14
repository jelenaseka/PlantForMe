import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CategoriesContext } from "../../context/plants/CategoriesContext";
import { AuthService } from "../../services/auth/AuthService";
import { tokenIsExpired } from "../../utils/functions/jwt";

const SaveCategoryDialog = ({title, handleOpen, handleClose, handleFeedback, category}) => {
  const categoriesContext = useContext(CategoriesContext)
  const [newCategory, setNewCategory] = useState(category);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = () => {
    if(tokenIsExpired() || categoriesContext.currentUser === null) {
      AuthService.logout();
      navigate("/login");
      return;
    }
    if (!validate()) {
      setError(true);
      setErrorMessage("Name must not be empty");
      return;
    }
    newCategory.id ? updateCategory() : createCategory();
    setError(false);
    setErrorMessage("");
  }

  const createCategory = () => {
    categoriesContext.createCategoryHandler({name: newCategory.name}).then(res => {
      if(res.ok) {
        handleFeedback({message: "Successfully added category!", ok: true})
      } else {
        handleFeedback({message: res.err, ok: false})
      }
    })
  }

  const updateCategory = () => {
    categoriesContext.updateCategoryHandler(newCategory).then(res => {
      if(res.ok) {
        handleFeedback({message: "Successfully edited category!", ok: true})
      } else {
        handleFeedback({message: res.err, ok: false})
      }
    })
  }

  const validate = () => {
    return newCategory.name.trim() !== ""
  }

  useEffect(() => {
    setNewCategory(category)
  }, [category])

  return (
    <Dialog open={handleOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Category must have unique name
          </DialogContentText>
          <TextField
            error={error}
            helperText={errorMessage}
            autoFocus
            margin="dense"
            id="name"
            label="Category name"
            type="text"
            fullWidth
            value={newCategory.name}
            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            onBlur={() => setNewCategory({...newCategory, name: newCategory.name.trim()})}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </DialogActions>
      </Dialog>
  )
}

export default SaveCategoryDialog