import { Box } from "@mui/material"
import React from "react"

const ListItem = ({icon, name, value}) => {
  return (
    <li>
      <Box sx={{display: 'flex', flexDirection: 'row' }} className="detail">
        <Box sx={{paddingTop:'10px', marginRight:'10px'}}>
          {icon}
        </Box>
        <Box>
          <b class="text-uppercase">{name}</b>
          <p class="text-left">{value}</p>
        </Box>
      </Box>
    </li>
  )
}

export default ListItem