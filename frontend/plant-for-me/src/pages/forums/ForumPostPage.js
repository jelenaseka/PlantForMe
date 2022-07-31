import { Avatar, Button, FormControl, Pagination, PaginationItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { ForumPostContext } from "../../context/forums/ForumPostContext";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AreYouSureDialog from "../../utils/components/AreYouSureDialog";
import EditIcon from '@mui/icons-material/Edit';

const ForumPostPage = () => {
  const postContext = useContext(ForumPostContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [comment, setComment] = useState("");
  const [areYouSureDialogOpen, setAreYouSureDialogOpen] = useState(false);
  const [areYouSureDeleteCommentDialogOpen, setAreYouSureDeleteCommentDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [editedPost, setEditedPost] = useState({})
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedComment, setEditedComment] = useState({});

  useEffect(() => {
    if(postContext.post) {
      setEditedPost({
        heading: postContext.post.heading,
        content: postContext.post.content,
        username: postContext.post.username,
        categoryID: postContext.post.categoryID,
        image: postContext.post.image
      })
    }
  }, [postContext.post])

  const handleSubmitComment = () => {
    if(comment.trim() === "") {
      toast.error("Comment must contain content");
      return;
    }

    postContext.submitCommentHandler(comment)
      .then(res => {
        if(res.ok) {
          postContext.getCommentsHandler();
          postContext.getCommentsCountHandler();
          setComment("");
          toast.success("Successfully added comment!");
        } else {
          toast.error(res.err);
        }
      })
  }

  const getCurrentUserForPost = () => {
    if (postContext.currentUser) {
      return postContext.post.username === postContext.currentUser.username;
    }
    return false;
  }

  const getCurrentUserForComment = (username) => {
    if (postContext.currentUser) {
      return username === postContext.currentUser.username;
    }
    return false;
  }

  const cancelEditPost = () => {
    setEditedPost({
      heading: postContext.post.heading,
      content: postContext.post.content,
      username: postContext.post.username,
      categoryID: postContext.post.categoryID,
      image: postContext.post.image
    })
    setEditMode(false);
  }

  const updatePost = () => {
    if(!isFormValid) {
      toast.error("not valid form");
      return;
    }
    postContext.updatePostHandler(editedPost, postContext.post.id)
      .then(res => {
        if(res.ok) {
          setEditMode(false);
          postContext.getPostHandler();
          toast.success("Successfully edited post!");
        } else {
          toast.error(res.err);
        }
      })
  }

  const updateComment = () => {
    if (editedComment.content.trim() === "") {
      toast.error("not valid form");
      return;
    }
    postContext.updateCommentHandler(editedComment, editedComment.id)
      .then(res => {
        if(res.ok) {
          setEditCommentMode(false);
          postContext.getCommentsHandler();
          toast.success("Successfully edited comment!");
        } else {
          toast.error(res.err);
        }
      })
  }

  const handleEditCommentMode = (comment) => {
    setSelectedComment(comment);
    setEditedComment(comment);
    setEditCommentMode(true);
  }
  
  const cancelEditComment = () => {
    setEditedComment(selectedComment);
    setEditCommentMode(false);
  }

  const deleteComment = () => {
    postContext.deleteCommentHandler(selectedComment.id)
      .then(res => {
        if(res.ok) {
          postContext.getCommentsHandler();
          postContext.getCommentsCountHandler();
          setAreYouSureDeleteCommentDialogOpen(false);
          toast.success("Successfully deleted comment!");
        } else {
          toast.error(res.err);
        }
      })
  }

  const isFormValid = () => {
    return (editedPost.heading.trim() !== "" && editedPost.content.trim() !== "" && editedPost.image !== "")
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    setEditedPost({...editedPost, image: base64})
    e.target.value = null;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
      <div>
        <ToastContainer />
      {
        postContext.post && postContext.comments &&
        <Box sx={{padding:'1em 0'}}>
          <AreYouSureDialog handleOpen={areYouSureDialogOpen} 
                  handleClose={() => setAreYouSureDialogOpen(false)} 
                  handleOperation={() => postContext.deletePostHandler(postContext.post.id)}
                  title="Delete post" content={"Are you sure you want to delete this post?"}/>
          <AreYouSureDialog handleOpen={areYouSureDeleteCommentDialogOpen} 
                  handleClose={() => setAreYouSureDeleteCommentDialogOpen(false)} 
                  handleOperation={() => deleteComment()}
                  title="Delete comment" content={"Are you sure you want to delete this comment?"}/>

          <Paper elevation={3} sx={{margin:'2em', padding:'2em'}}>
            <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
              <Box sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <Avatar alt={postContext.post.username} src="/images/user.png" />
                <Typography variant="caption" display="block" sx={{paddingLeft:'1em'}} gutterBottom>
                  created by {postContext.post.username}
                </Typography>
              </Box>
              <Box sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <Typography variant="caption" display="block" sx={{margin:'0'}} gutterBottom>
                  {postContext.post.createdAt}
                </Typography>
                {
                  getCurrentUserForPost() &&
                  <div>
                    <Button onClick={() => setAreYouSureDialogOpen(true)}>
                      <DeleteIcon/>
                    </Button>
                    {
                      !editMode &&
                      <Button onClick={() => setEditMode(true)}>
                        <EditIcon/>
                      </Button>
                    }
                    {
                      editMode &&
                      <div>
                        <Button onClick={() => updatePost()}>
                          Save
                        </Button>
                        <Button onClick={() => cancelEditPost()}>
                          Cancel
                        </Button>
                      </div>
                    }
                  </div>
                }
              </Box>
            </Box>
            {
              !editMode &&
              <div>
                <Typography variant="h1" component="div" gutterBottom sx={{fontSize:'2em', marginTop:'1em'}}>
                  {postContext.post.heading}
                </Typography>
                <Typography variant="overline" display="block" gutterBottom>
                  {postContext.commentsCount} {postContext.commentsCount === 1 ? `comment` : `comments`}
                </Typography>
                <Typography variant="body1" gutterBottom>
                {postContext.post.content} 
                </Typography>
              </div>
              
            }
            {
              postContext.post.image && !editMode &&
              <div className="placeholder-post-image">
                <img  src={postContext.post.image} alt="Your post"/>
              </div>
            }
            {
              editMode &&
              <Box sx={{display:'flex', flexDirection:'column'}}>
                <TextField
                  sx={{marginTop:'1em'}}
                  label="Heading" 
                  variant="filled" 
                  value={editedPost.heading}
                  onChange={(e) => setEditedPost({...editedPost, heading: e.target.value})} 
                  onBlur={() => setEditedPost({...editedPost, heading: editedPost.heading.trim()})} 
                />
                <TextField
                  sx={{marginTop:'1em'}}
                  label="Content" 
                  variant="filled"
                  multiline
                  rows={10}
                  value={editedPost.content}
                  onChange={(e) => setEditedPost({...editedPost, content: e.target.value})} 
                  onBlur={() => setEditedPost({...editedPost, content: editedPost.content.trim()})} 
                />
              </Box>
            }
            {
              postContext.post.image && editMode &&
              <div>
                <Button
                  variant="contained"
                  component="label"
                  sx={{marginTop:'1em'}}
                >
                  Upload image
                  <input type="file" onChange={(e) => handleFileUpload(e)} hidden/>
                </Button>
                
                <div className="image-placeholder">
                  <img src={editedPost.image} alt='Your post'/>
                </div>
              </div>
              
            }
            
            
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
                  {
                    getCurrentUserForComment(comment.username) &&
                    <div>
                      <Button onClick={() => {
                        setSelectedComment(comment);
                        return setAreYouSureDeleteCommentDialogOpen(true); 
                        }}>
                        <DeleteIcon/>
                      </Button>
                      {
                        !editCommentMode &&
                        <Button onClick={() => handleEditCommentMode(comment)}>
                          <EditIcon/>
                        </Button>
                      }
                      {
                        editCommentMode && selectedComment.id === comment.id &&
                        <div>
                          <Button onClick={() => updateComment()}>
                            Save
                          </Button>
                          <Button onClick={() => cancelEditComment()}>
                            Cancel
                          </Button>
                        </div>
                      }
                      
                    </div>
                    
                  }
                </Box>
                {
                  !editCommentMode &&
                  <Typography variant="body1" gutterBottom sx={{marginTop:'1em'}}>
                    {comment.content} 
                  </Typography>
                }
                {
                  editCommentMode && selectedComment.id === comment.id &&
                  <TextField
                    fullWidth
                    sx={{marginTop:'1em'}}
                    label="Content" 
                    variant="filled"
                    multiline
                    rows={10}
                    value={editedComment.content}
                    onChange={(e) => setEditedComment({...editedComment, content: e.target.value})} 
                    onBlur={() => setEditedComment({...editedComment, content: editedComment.content.trim()})} 
                  />
                }
              </Paper>
            ))
          }
          {
            postContext.currentUser &&
            <Paper elevation={3} sx={{margin:'2em', padding:'2em'}}>
              Leave a comment
              <FormControl fullWidth sx={{ m: 1 }}>
                <TextField
                  id="standard-multiline-flexible"
                  multiline
                  maxRows={25}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onBlur={() => setComment(comment.trim())}
                  variant="standard"
                />
              </FormControl>
              <Box sx={{display:'flex', flexDirection:'row', justifyContent: 'end'}}>
                <Button variant="contained" onClick={() => handleSubmitComment()}>Submit</Button>
              </Box>
              
            </Paper>
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