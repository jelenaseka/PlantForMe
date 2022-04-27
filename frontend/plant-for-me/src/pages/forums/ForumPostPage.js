import { Avatar, Pagination, PaginationItem, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { ForumPostContext } from "../../context/forums/ForumPostContext";
import { Link, useLocation } from "react-router-dom";

const ForumPostPage = () => {
  const postContext = useContext(ForumPostContext);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);

  return (
      <div>
      {
        postContext.post && postContext.comments &&
        <Box sx={{padding:'1em 0'}}>
          <Paper elevation={3} sx={{margin:'2em', padding:'2em'}}>
            <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
              <Box sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <Avatar alt={postContext.post.username} src="/images/user.png" />
                <Typography variant="caption" display="block" sx={{paddingLeft:'1em'}} gutterBottom>
                  created by {postContext.post.username}
                </Typography>
              </Box>
              <Typography variant="caption" display="block" gutterBottom>
                {postContext.post.createdAt}
              </Typography>
            </Box>
            <Typography variant="h1" component="div" gutterBottom sx={{fontSize:'2em', marginTop:'1em'}}>
              {postContext.post.heading}
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
              {postContext.commentsCount} {postContext.commentsCount === 1 ? `comment` : `comments`}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {postContext.post.content} 
            </Typography>
          </Paper>
          {
            postContext.comments.map(comment => (
              <Paper key={comment.id} elevation={3} sx={{margin:'2em', padding:'2em'}}>
                <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Avatar alt={comment.username} />
                  <div>
                    <Typography variant="subtitle2" display="block" sx={{paddingLeft:'1em'}} gutterBottom>
                      {comment.username}
                    </Typography>
                    <Typography variant="caption" sx={{paddingLeft:'1em'}} display="block" gutterBottom>
                      {comment.createdAt}
                    </Typography>
                  </div>
                </Box>
                <Typography variant="body1" gutterBottom sx={{marginTop:'1em'}}>
                  {comment.content} 
                </Typography>
              </Paper>
            ))
          }
          {
            postContext.commentsCount > 0 &&
            <Box sx={{display:'flex', flexDirection: 'row', justifyContent:'center'}}>
              <Pagination
              count={postContext.pagesNum} page={page}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/forums/${postContext.post.id}${item.page === 1 ? '' : `?page=${item.page}`}`}
                  {...item}
                  />
              )}
              />
            </Box>
            
          }
          
        </Box>
      }
      </div>
  )
}

export default ForumPostPage;