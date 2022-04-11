import React   from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const MySelect = ({label, options, selected, onValueChange, isFiltering}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select sx={{ marginBottom: '15px'}}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selected}
        label={label}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {isFiltering &&
          <MenuItem value="-1">None</MenuItem>
        }
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MySelect