import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react"
import { ForumsContext } from "../../context/forums/ForumsContext";
import MySelect from "../../utils/components/MySelect";


const CreatePostDialog = ({handleOpen, handleClose}) => {
  const forumContext = useContext(ForumsContext);
  
  const [post, setPost] = useState({
    heading: "",
    content: "",
    username: forumContext.currentUser.username,
    categoryId: "",
    image: ""
  })

  const createPost = () => {
    if(!isFormValid()) {
      console.log('nije validna')
      return;
    }
    forumContext.createPostHandler(post)
      .then(res => {
        if(res.ok) {
          setPost({
            heading: "",
            content: "",
            username: forumContext.currentUser.username,
            categoryId: "",
            image: ""
          })
          handleClose(true)
        } else {
          //error
        }
      })
    
  }

  const isFormValid = () => {
    return (post.heading.trim() !== "" && post.content.trim() !== "" && post.categoryId !== "" && post.image !== "")
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    setPost({...post, image: base64})
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
    <Dialog 
      open={handleOpen} 
      onClose={handleClose} 
      fullWidth
      maxWidth='md'>
        
      <DialogTitle>Create new post</DialogTitle>
      <DialogContent>
        <MySelect label="Category" options={forumContext.categories} selected={post.categoryId} onValueChange={(categoryId) => setPost({...post, categoryId})} isFiltering={false}/>
        
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Heading"
          type="text"
          fullWidth
          value={post.heading} 
          onChange={(e) => setPost({...post, heading: e.target.value})} 
          onBlur={() => setPost({...post, heading: post.heading.trim()})}
          variant="standard"
        />
        <TextField
          sx={{margin:'1em 0'}}
          fullWidth
          id="standard-multiline-flexible"
          multiline
          label="Content"
          rows={10}
          value={post.content}
          onChange={(e) => setPost({...post, content: e.target.value})}
          onBlur={() => setPost({...post, content: post.content.trim()})}
          variant="outlined"
        />
        <Button
          variant="contained"
          component="label"
        >
          Upload image
          <input type="file" onChange={(e) => handleFileUpload(e)} hidden/>
        </Button>
        
        <Typography variant="subtitle1" gutterBottom component="div">
          Image preview
        </Typography>
        <div className="image-placeholder">
          <img src={post.image} alt='Your post'/>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => createPost()}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreatePostDialog;