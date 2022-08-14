import React from "react"
import { useEffect, useState } from "react"
import { CategoryService } from "../../services/plants/CategoryService"
import { CategoriesContext } from "../../context/plants/CategoriesContext"
import CategoriesPage from "../../pages/plants/CategoriesPage"
import { AuthService } from "../../services/auth/AuthService"
import { useNavigate } from 'react-router-dom';
import { tokenIsExpired } from "../../utils/functions/jwt"

const CategoriesContainer = () => {
  const [categories, setCategories] = useState([])
  const currentUser = AuthService.getCurrentUser()
  let navigate = useNavigate();

  useEffect(() => {
    if(tokenIsExpired() || currentUser === null) {
      AuthService.logout();
      navigate("/login");
    }
    if(currentUser.role !== 2) {
      navigate("/404");
    }
    getCategoriesHandler();
  }, [])

  const getCategoriesHandler = () => {
    const getData = CategoryService.getCategories()
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.log(await res.text());
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
    return getData;
  }

  const createCategoryHandler = (category) => {
    const createCategory = CategoryService.createCategory(category)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
        
    return createCategory;
  }

  const updateCategoryHandler = (category) => {
    const updateCategory = CategoryService.updateCategory(category)
    .then(async res => {
      if(res.ok) {
        return { ok: true, err: null}
      } else {
        const data = await res.text();
        return { ok: false, err: data}
      }
    })
    .catch(err => {
      console.log('err: ',err)
    })
    return updateCategory;
  }

  const deleteCategoryHandler = (categoryID) => {
    const deleteCategory = CategoryService.deleteCategory(categoryID)
      .then(async res => {
        console.log(res)
        if(res.ok) {
          return { ok: true, err: null };
        } else {
          console.log(res)
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
    return deleteCategory;
  }

  return (
    <CategoriesContext.Provider value={
      {
        categories,
        getCategoriesHandler,
        createCategoryHandler, 
        deleteCategoryHandler, 
        updateCategoryHandler,
        currentUser
      }
      }>
      <CategoriesPage />
    </CategoriesContext.Provider>
  )
}

export default CategoriesContainer