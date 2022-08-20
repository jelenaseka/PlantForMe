import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CategoryDialog = ({open, handleCancel, handleSubmit, selectedCategory}) => {
  const [category, setCategory] = useState({name: ''})

  useEffect(() => {
    setCategory(selectedCategory)
  }, [selectedCategory])

  const submit = () => {
    if(category.name.trim() === "") {
      toast.error("Form not valid!")
      return;
    }
    handleSubmit(category);
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category name"
            type="text"
            fullWidth
            
            variant="standard"
            value={category.name}
            onChange={(e) => setCategory({...category, name: e.target.value})} 
            // onBlur={() => setCategory({...category, name: category.name.trim()})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={() => submit()}>Submit</Button>
        </DialogActions>
      </Dialog>   
  )
}

export default CategoryDialog;