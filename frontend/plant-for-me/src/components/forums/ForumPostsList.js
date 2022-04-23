import { Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText,  Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ForumPostsList = ({posts, title}) => {
  return (
    <Box sx={{ bgcolor: '#fff', margin:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
      <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
        {title}
      </Typography>
      <nav aria-label="main mailbox folders">
        <List sx={{padding:'0'}}>
          {
            posts.map((post, index) => (
              <div key={index}>
                <ListItem disablePadding>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item md={8}>
                      <ListItemButton>
                        <ListItemIcon>
                          <ChatBubbleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary={post.heading} />
                      </ListItemButton>
                    </Grid>
                    <Grid item md={2}>
                      <Typography sx={{color:'rgb(173, 173, 173)', margin:'0'}} variant="caption" display="block" gutterBottom>
                      by {post.username}
                      </Typography>
                      <Typography sx={{fontWeight:'100', fontSize:'15px'}} variant="" gutterBottom>
                      {post.createdAt}
                      </Typography>
                    </Grid>
                    <Grid item md={2} sx={{textAlign:'center'}}>
                      <span>{post.commentsCount}</span>
                    </Grid>
                  </Grid>
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

export default ForumPostsList;