import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ForumPostContext } from '../../context/forums/ForumPostContext'
import ForumPostPage from "../../pages/forums/ForumPostPage";
import { ForumPostService } from "../../services/forum/ForumPostService";
import { useNavigate } from "react-router-dom";
import { CommentsService } from "../../services/forum/CommentsService";
import { AuthService } from "../../services/auth/AuthService"

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ForumPostContainer = () => {
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [pagesNum, setPagesNum] = useState(0)
  const currentUser = AuthService.getCurrentUser()
  const { id } = useParams();
  let query = useQuery();
  const currentPage = query.get("page")
  let navigate = useNavigate();
  
  useEffect(() => {
    getPostHandler()
    getCommentsCountHandler()
    getCommentsHandler()
  }, [currentPage, id])

  const getCommentsHandler = () => {
    CommentsService.getCommentsByPostId(id, currentPage)
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setComments(data);
        } else {
          return navigate("/plants");
        }
      })
      .catch(err => console.log(err))
  }

  const getCommentsCountHandler = () => {
    CommentsService.getCommentsCountByPostId(id)
      .then(async res => {
        if (res.ok) {
          const data = await res.text();
          var count = parseInt(data)
          setCommentsCount(count)
          if (count % 3 !== 0) {
            count = Math.floor(count / 3) + 1
          } else {
            count = Math.floor(count / 3)
          }
          setPagesNum(count)
          
        } else {
          return navigate("/plants");
        }
      })
      .catch(err => console.log(err))
  }

  const getPostHandler = () => {
    ForumPostService.getOne(id)
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          return setPost(data);
        } else {
          return navigate("/404");
        }
      })
      .catch(err => console.log(err))
  }

  const submitCommentHandler = (content) => {
    const comment = {
      content,
      postId: id,
      username: currentUser.username
    }
    const submitComment = CommentsService.submitComment(comment)
        .then(async res => {
          if (res.ok) {
            await res.text();
            return { ok: true, err: null };
            
          } else {
            const data = await res.text();
            return { ok: false, err: data };
          }
        })
        .catch(err => console.log(err))

    return submitComment;
  }

  const deletePostHandler = (id) => {
    ForumPostService.deletePost(id)
      .then(async res => {
        return navigate("/forums");
      })
      .catch(err => console.log(err))
  }

  const updatePostHandler = (post, id) => {
    const updatePost = ForumPostService.updatePost(post, id)
      .then(async res => {
        if(res.ok) {
          await res.text();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => console.log(err))

    return updatePost;
  }

  const updateCommentHandler = (comment, id) => {
    const updateComment = CommentsService.updateComment(comment, id)
      .then(async res => {
        if(res.ok) {
          await res.text();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => console.log(err))

    return updateComment;
  }

  const deleteCommentHandler = (id) => {
    const deleteComment = CommentsService.deleteComment(id)
      .then(async res => {
        if(res.ok) {
          await res.text();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => console.log(err))

    return deleteComment;
  }

  return (
    <ForumPostContext.Provider value={
        {post, 
        commentsCount, 
        comments, 
        pagesNum, 
        currentUser, 
        submitCommentHandler, 
        getCommentsHandler,
        getCommentsCountHandler,
        getPostHandler,
        deletePostHandler,
        updatePostHandler,
        updateCommentHandler,
        deleteCommentHandler}
      }>
      <ForumPostPage />
    </ForumPostContext.Provider>
  )
}

export default ForumPostContainer;