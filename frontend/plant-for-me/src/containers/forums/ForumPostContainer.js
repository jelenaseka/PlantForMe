import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ForumPostContext } from '../../context/forums/ForumPostContext'
import ForumPostPage from "../../pages/forums/ForumPostPage";
import { ForumPostService } from "../../services/forum/ForumPostService";
import { useNavigate } from "react-router-dom";
import { CommentsService } from "../../services/forum/CommentsService";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ForumPostContainer = () => {
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [pagesNum, setPagesNum] = useState(0)
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
        if (!res.ok) {
          return navigate("/plants");
        } else {
          const data = await res.json();
          setComments(data);
        }
      })
      .catch(err => console.log(err))
  }

  const getCommentsCountHandler = () => {
    CommentsService.getCommentsCountByPostId(id)
      .then(async res => {
        if (!res.ok) {
          return navigate("/plants");
        } else {
          const data = await res.text();
          var count = parseInt(data)
          setCommentsCount(count)
          if (count % 3 !== 0) {
            count = Math.floor(count / 3) + 1
          } else {
            count = Math.floor(count / 3)
          }
          setPagesNum(count)
        }
      })
      .catch(err => console.log(err))
  }

  const getPostHandler = () => {
    ForumPostService.getOne(id)
      .then(async res => {
        if (!res.ok) {
          return navigate("/404");
        } else {
          const data = await res.json();
          return setPost(data);
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <ForumPostContext.Provider value={{post, commentsCount, comments, pagesNum}}>
      <ForumPostPage />
    </ForumPostContext.Provider>
  )
}

export default ForumPostContainer;