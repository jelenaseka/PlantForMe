import React from "react"
import { useEffect, useState } from "react"
import { CategoryService } from "../../services/plants/CategoryService"
import { CategoriesContext } from "../../context/plants/CategoriesContext"
import CategoriesPage from "../../pages/plants/CategoriesPage"

const CategoriesContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategoriesHandler()
  }, [])

  const getCategoriesHandler = () => {
    const getData = CategoryService.getCategories()
      .then(async res => {
        if(res.ok) {
          console.log('soooo')
          const data = await res.json();
          setCategories(data);
        } else {
          //TODO sorry, something went wrong
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
          getCategoriesHandler();
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
        getCategoriesHandler();
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
        if(res.ok) {
          getCategoriesHandler();
          return { ok: true, err: null };
        } else {
          //TODO sorry, something went wrong
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
        createCategoryHandler, 
        deleteCategoryHandler, 
        updateCategoryHandler, 
      }
      }>
      <CategoriesPage />
    </CategoriesContext.Provider>
  )
}

export default CategoriesContainer