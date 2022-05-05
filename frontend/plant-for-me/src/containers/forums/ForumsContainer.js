import React, { useEffect, useMemo, useState } from "react";
import { ForumsContext } from '../../context/forums/ForumsContext'
import ForumsPage from "../../pages/forums/ForumsPage";
import { ForumPostService } from "../../services/forum/ForumPostService";
import { ForumCategoryService } from "../../services/forum/ForumCategoryService";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth/AuthService"

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ForumsContainer = () => {
  const [categories, setCategories] = useState([])
  const [mostPopularPosts, setMostPopularPosts] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [postsCount, setPostsCount] = useState(0);
  const currentUser = AuthService.getCurrentUser();
  let query = useQuery();
  const currentPage = query.get("page")
  const currentCategory = query.get("category");
  let navigate = useNavigate();

  useEffect(() => {
    console.log(currentUser)
    getPostsDataHandler()
    getMostPopularPostsHandler()
    getPostsCount()
    getCategoriesHandler()
  }, [currentPage, currentCategory])

  const getPostsDataHandler = () => {
    getAllPostsHandler(currentPage, currentCategory)
    getLatestPostsHandler()
  }

  const getMostPopularPostsHandler = () => {
    const getData = async () => {
      try {
        const mostPopularPostsResponse = await ForumPostService.getMostPopularPostsCountComments()
        if(!mostPopularPostsResponse.ok) {
          const err = await mostPopularPostsResponse.text();
          return {ok: false, err: err};
        } else {
          const data = await mostPopularPostsResponse.json();
          setMostPopularPosts(data)
        }
      } catch(err) { console.log(err) }
    }
    getData();
  }

  const getCategoriesHandler = () => {
    const getData = async () => {
      try {
        const categoriesResponse = await ForumCategoryService.getCategoriesCountPosts()
        if(!categoriesResponse.ok) {
          const err = await categoriesResponse.text();
          return {ok: false, err: err};
        } else {
          const data = await categoriesResponse.json();
          setCategories(data)
        }
        
      } catch(err) { console.log(err) }
    }
    getData();
  }

  const getPostsCount = () => {
    //TODO change 
    const getData = async () => {
      try {
        const postsCountResponse = await ForumPostService.getPostsCount(currentCategory)
        if(!postsCountResponse.ok) {
          const err = await postsCountResponse.text();
          return {ok: false, err: err};
        } else {
          const data = await postsCountResponse.text();
          var count = parseInt(data)
          if (count % 3 !== 0) {
            count = Math.floor(count / 3) + 1
          } else {
            count = Math.floor(count / 3)
          }
          setPostsCount(count)
        }
      } catch(err) { console.log(err) }
    }
    getData()
  }

  const getAllPostsHandler = (page, category) => {
    console.log(category)
    const getData = async () => {
      try {
        const allPostsResponse = await ForumPostService.getAllPostsCountComments(page, category)
        if(!allPostsResponse.ok) {
          const err = await allPostsResponse.text();
          return {ok: false, err: err};
        } else {
          const data = await allPostsResponse.json();
          setAllPosts(data)
        }
      } catch(err) { console.log(err) }
    }
    getData()
  }

  const getLatestPostsHandler = () => {
    const getData = async () => {
      try {
        const latestPostsResponse = await ForumPostService.getLatestPostsCountComments()
        if(!latestPostsResponse.ok) {
          const err = await latestPostsResponse.text();
          return {ok: false, err: err};
        } else {
          const data = await latestPostsResponse.json();
          setLatestPosts(data)
        }
      } catch(err) { console.log(err) }
    }
    getData();
  }

  const createPostHandler = (post) => {
    const createPost = ForumPostService.createPost(post)
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
      return createPost;
  }

  const createCategoryHandler = (category) => {
    const createCategory = ForumCategoryService.createCategory(category)
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
    return createCategory;
  }

  const deleteCategoryHandler = (id) => {
    ForumCategoryService.deleteCategory(id)
      .then(async res => {
        return navigate("/forums");
      })
      .catch(err => console.log(err))
  }

  const editCategoryHandler = (category, id) => {
    ForumCategoryService.updateCategory(category, id)
      .then(async res => {
        return navigate("/forums");
      })
      .catch(err => console.log(err))
  }

  return (
    <ForumsContext.Provider value={{
      categories, 
      mostPopularPosts, 
      latestPosts, 
      allPosts, 
      postsCount, 
      currentPage, 
      currentCategory, 
      currentUser,
      createPostHandler,
      getPostsDataHandler,
      getCategoriesHandler,
      createCategoryHandler,
      deleteCategoryHandler,
      editCategoryHandler}}>
      <ForumsPage />
    </ForumsContext.Provider>
  )
}

export default ForumsContainer;