import { Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Pagination, PaginationItem, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GrassIcon from '@mui/icons-material/Grass';
import { ForumsContext } from "../../context/forums/ForumsContext";
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { Link, NavLink, useLocation } from "react-router-dom";

const ForumsPage = () => {
  const forumContext = useContext(ForumsContext)
  //todo mozda nece trebati
  const [selectedCategory, setSelectedCategory] = React.useState("-1");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 3);

  const handleListItemClick = (event, categoryId) => {
    console.log(categoryId)
    setSelectedCategory(categoryId);
  };

  const getCurrentLink = (page, category) => {
    const params = new URLSearchParams()
    if(page !== 1 && page !== null) {
      params.append("page", page)
    }
    if(category !== undefined && category !== null) {
      params.append("category", category)
    }
    return "/forums?" + params.toString()
  }

  return (
    <Grid container justifyContent="center" sx={{background:'#F8F8F8'}}>
      <Grid item md={8} >
      
        <Box sx={{ bgcolor: '#fff', margin:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
          <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
            Popular posts
          </Typography>
          <nav aria-label="main mailbox folders">
            <List sx={{padding:'0'}}>
              {
                forumContext.mostPopularPosts.map((post, index) => (
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

        <Box sx={{ bgcolor: '#fff', margin:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
          <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
            All posts
          </Typography>
          <nav aria-label="main mailbox folders">
            <List sx={{padding:'0'}}>
              {
                forumContext.allPosts.map((post, index) => (
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

        <Stack spacing={2}>
          <Pagination count={forumContext.postsCount} page={page}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={getCurrentLink(item.page, forumContext.currentCategory)}
                {...item}
                />
            )}
          />
        </Stack>









      </Grid>
      <Grid item md={4}>
        <Box sx={{ bgcolor: '#fff', margin:'2em' ,boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA'}}>
          <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center',paddingTop:'1em'}}>
            <ListItemIcon sx={{marginLeft:'1em'}}>
              <ChatBubbleOutlineIcon />
            </ListItemIcon>
            <Typography variant="button" gutterBottom component="div">
              Recent posts
            </Typography>
          </Box>
        
          <nav aria-label="main mailbox folders">
            <List sx={{padding:'0'}}>
              {
                forumContext.latestPosts.map((post, index) => (
                  <div key={index}>
                    <ListItem disablePadding>
                      <ListItemButton>
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

        <Box sx={{ bgcolor: '#fff', margin:'2em',boxShadow: '0 0 6px rgb(0 0 0 / 3%)',borderColor: '#EAEAEA' }}>
          <Typography sx={{padding:'1em', bgcolor:'#455A64', color:'#fff'}} variant="button" gutterBottom component="div">
            Categories
          </Typography>
          <nav aria-label="main mailbox folders">
            <List sx={{padding:'0'}}>
              <ListItemButton 
                selected={selectedCategory === '-1'} 
                onClick={(event) => handleListItemClick(event, "-1")}>
                <ListItemIcon>
                  <FormatListBulletedOutlinedIcon />
                </ListItemIcon>
                <Link component={NavLink}
                            to={getCurrentLink(forumContext.currentPage, undefined)}
                          >All categories</Link>
              </ListItemButton>
              {
                forumContext.categories.map((category, index) => (
                  <div key={index}>
                    <ListItem disablePadding>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item md={8}>
                        <ListItemButton 
                          selected={selectedCategory === category.id} 
                          onClick={(event) => handleListItemClick(event, category.id)}>
                          <ListItemIcon>
                            <GrassIcon />
                          </ListItemIcon>
                          <Link component={NavLink}
                            // to={getCurrentLink(forumContext.currentPage, category.name)}
                            to={`/forums?category=${category.name}`}
                          >{category.name}</Link>

                          </ListItemButton>
                      </Grid>
                      <Grid item md={4} sx={{paddingRight:'1em', textAlign:'right'}}>
                        {category.postsCount} posts
                      </Grid>
                    </Grid>
                    </ListItem>
                    <Divider></Divider>
                  </div>
                ))
              }
            </List>
          </nav>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ForumsPage;