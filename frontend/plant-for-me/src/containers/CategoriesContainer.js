import React from "react"
import { useEffect, useState } from "react"
import { CategoryService } from "../services/CategoryService"
import { CategoriesContext } from "../context/CategoriesContext"
import CategoriesPage from "../pages/CategoriesPage"

const CategoriesContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        setCategories(await CategoryService.getCategories())
      } catch(err) { console.log(err) }
    }
    getData()
  }, [])

  const createCategoryHandler = (category) => {
    const createCategory = async () => {
      try {
        await CategoryService.createCategory(category)
        setCategories(await CategoryService.getCategories())
        return true
      } catch(err) {
        console.log(err)
        return false
      }
    }
    return createCategory()
  }

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
    const updateCategory = async () => {
      try {
        await CategoryService.updateCategory(category)
        setCategories(await CategoryService.getCategories())
        return true;
      } catch (err) { console.log(err); return false }
    }
    return updateCategory()
  }

  return (
    <CategoriesContext.Provider value={{categories, createCategoryHandler, deleteCategoryHandler, updateCategoryHandler}}>
      <CategoriesPage />
    </CategoriesContext.Provider>
  )
}

export default CategoriesContainer