import { Grid, Pagination, PaginationItem, Stack } from "@mui/material";
import React, { useContext } from "react";
import { ForumsContext } from "../../context/forums/ForumsContext";
import { Link, useLocation } from "react-router-dom";
import ForumPostsList from "../../components/forums/ForumPostsList";
import ForumRecentPostsList from "../../components/forums/ForumRecentPostsList";
import ForumCategoriesList from "../../components/forums/ForumCategoriesList";

const ForumsPage = () => {
  const forumContext = useContext(ForumsContext)

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);

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
      <Grid item  md={8} >
        <ForumPostsList posts={forumContext.mostPopularPosts} title="Popular posts"/>
        <ForumPostsList posts={forumContext.allPosts} title="All posts"/>
        <Stack spacing={2} >
          <Pagination 
            count={forumContext.postsCount} page={page}
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
        <ForumRecentPostsList posts={forumContext.latestPosts} title="Recent posts"/>
        <ForumCategoriesList categories={forumContext.categories}/>
      </Grid>
    </Grid>
  )
}

export default ForumsPage;