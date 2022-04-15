import React from "react"
import { useEffect, useState } from "react"
import { CategoryService } from "../../services/plants/CategoryService"
import { CategoriesContext } from "../../context/plants/CategoriesContext"
import CategoriesPage from "../../pages/plants/CategoriesPage"

const CategoriesContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getAllHandler()
  }, [])

  const getAllHandler = () => {
    const getData = async () => {
      try {
        setCategories(await CategoryService.getCategories())
      } catch(err) { console.log(err) }
    }
    getData()
  }

  //TODO popravi ovo
  const createCategoryHandler = (category) => {
    const createCategory = CategoryService.createCategory(category)
      .then(response => response.text())
      .then(data => {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(data.startsWith("\"")) {
          data = data.slice(1, -2)
        }
        
        if(regexExp.test(data)) {
          
          return { ok: true, err: null}
          
        } else {
          return { ok: false, err: data}
        }

    }).catch(err => {
      console.log('err: ',err)
    })
        
    return createCategory;
  }

  // TODO popravi
  const deleteCategoryHandler = (categoryID) => {
    const deleteCategory = async () => {
      try {
        await CategoryService.deleteCategory(categoryID)
        setCategories(await CategoryService.getCategories())
        return true
      } catch (err) { console.log(err);return false }
    }
    return deleteCategory()
  }

  const updateCategoryHandler = (category) => {
    const updateCategory = CategoryService.updateCategory(category)
    .then(response => response.text())
    .then(data => {
      if(data === "") {
        return { ok: true, err: null}
      } else {
        return { ok: false, err: data}
      }
    }).catch(err => {
      console.log('err: ',err)
    })
    return updateCategory
  }

  return (
    <CategoriesContext.Provider value={{categories, createCategoryHandler, deleteCategoryHandler, updateCategoryHandler, getAllHandler}}>
      <CategoriesPage />
    </CategoriesContext.Provider>
  )
}

export default CategoriesContainer