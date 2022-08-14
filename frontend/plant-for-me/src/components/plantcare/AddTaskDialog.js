
import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import isBefore from 'date-fns/isBefore';
import { toast } from "react-toastify";

const AddTaskDialog = ({open, handleCancel,  handleSubmit}) => {
  const [task, setTask] = useState({
    type: 0,
    notes: "",
    date: null
  });

  const submitTask = () => {
    
    if(task.date === null || isBefore(task.date, new Date())) {
      toast.error("Invalid data in the field.") //todo change to underline text
      return;
    }
    handleSubmit(task);
    setTask({
      type: 0,
      notes: "",
      date: null
    });
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>Add task</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{margin:'1em 0'}}>
          <InputLabel id="demo-simple-select-label">Task type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={task.type}
            label="Task type"
            onChange={(e) => setTask({...task, type: e.target.value})}
          >
            <MenuItem value={0}>Watering</MenuItem>
            <MenuItem value={1}>Transplant</MenuItem>
            <MenuItem value={2}>Trime</MenuItem>
            <MenuItem value={3}>Fertilize</MenuItem>
            <MenuItem value={4}>Fungicide</MenuItem>
            <MenuItem value={5}>Insecticide</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{marginBottom:'1em'}}
          autoFocus
          margin="dense"
          label="Task notes"
          type="text"
          fullWidth
          value={task.notes}
          onChange={(e) => setTask({...task, notes: e.target.value})}
          onBlur={() => setTask({...task, notes: task.notes.trim()})} 
          variant="standard"
        />
        <FormControl fullWidth sx={{marginTop:'1em'}}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Basic example"
              value={task.date}
              onChange={(newValue) => {
                setTask({...task, date: newValue});
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={() => submitTask()}>Submit</Button>
      </DialogActions>
    </Dialog> 
  )
}

export default AddTaskDialog;