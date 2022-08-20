import React, { useEffect, useMemo, useState } from "react";
import { ForumsContext } from '../../context/forums/ForumsContext'
import ForumsPage from "../../pages/forums/ForumsPage";
import { ForumPostService } from "../../services/forum/ForumPostService";
import { ForumCategoryService } from "../../services/forum/ForumCategoryService";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth/AuthService"
import { tokenIsExpired } from "../../utils/functions/jwt";

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
    if(tokenIsExpired()) {
      AuthService.logout();
    }
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
    const getData = ForumPostService.getMostPopularPostsCountComments()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setMostPopularPosts(data));
        } else {
          const err = await res.text();
          return {ok: false, err: err};
        }
      }).catch(err =>  console.log(err));
    return getData;
  }

  const getCategoriesHandler = () => {
    const getData = ForumCategoryService.getCategoriesCountPosts()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setCategories(data));
        } else {
          return await res.text().then(data => console.log(data));
        }
      }).catch(err => console.log(err));
    return getData;
  }

  const getPostsCount = () => {
    const getData = ForumPostService.getPostsCount(currentCategory)
      .then(async res => {
        if(res.ok) {
          const data = await res.text();
          var count = parseInt(data)
          if (count % 3 !== 0) {
            count = Math.floor(count / 3) + 1
          } else {
            count = Math.floor(count / 3)
          }
          setPostsCount(count)
          
        } else {
          const err = await res.text();
          return {ok: false, err: err};
        }
      }).catch(err => console.log(err));
    return getData;
  }

  const getAllPostsHandler = (page, category) => {
    const getData = ForumPostService.getAllPostsCountComments(page, category)
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setAllPosts(data));
        } else {
          const err = await res.text();
          return {ok: false, err: err};
        }
      }).catch(err => console.log(err));
    return getData;
  }

  const getLatestPostsHandler = () => {
    const getData = ForumPostService.getLatestPostsCountComments()
      .then(async res => {
        if(res.ok) {
          return await res.json().then(data => setLatestPosts(data));
        } else {
          const err = await res.text();
          return {ok: false, err: err};
        }
      }).catch(err => console.log(err));
    return getData;
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

  const editCategoryHandler = (category) => {
    const updateCategory = ForumCategoryService.updateCategory(category)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null};
        } else {
          return { ok: false, err: await res.text()}
        }
      })
      .catch(err => console.log(err));
    return updateCategory;
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