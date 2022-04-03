import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material"
import React from "react"

const MyCheckboxList = ({label, options, isChecked, onValueChange}) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup aria-label="position" row>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value="end"
            control={
              <Checkbox checked={isChecked(index)}
              onChange={(e) => onValueChange(index)}/>
            }
            label={option}
            labelPlacement="end"
          />
          ))}
        
      </FormGroup>
    </FormControl>
  )
}

export default MyCheckboxList