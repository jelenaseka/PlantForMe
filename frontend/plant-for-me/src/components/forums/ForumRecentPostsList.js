import React from "react";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { NavLink } from "react-router-dom";

const ForumRecentPostsList = ({posts, title}) => {
  return (
    <Box sx={{ bgcolor: '#fff', margin:'2em' ,boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA'}}>
      <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center',paddingTop:'1em'}}>
        <ListItemIcon sx={{marginLeft:'1em'}}>
          <ChatBubbleOutlineIcon />
        </ListItemIcon>
        <Typography variant="button" gutterBottom component="div">
          {title}
        </Typography>
      </Box>
    
      <nav aria-label="main mailbox folders">
        <List sx={{padding:'0'}}>
          {
            posts.map((post, index) => (
              <div key={index}>
                <ListItem disablePadding>
                  <ListItemButton component={NavLink} to={`/forums/${post.id}`}>
                    <ListItemText primary={post.heading} secondary={`by ${post.username} in category ${post.categoryResponse.name}`} />
                  </ListItemButton>
                  </ListItem>
                  <Divider/>
              </div>
            ))
          }
          
        </List>
      </nav>
    </Box>
  )
}

export default ForumRecentPostsList;