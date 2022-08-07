import React, { useEffect, useState } from "react";
import { CollectionContext } from "../../context/plantcare/CollectionContext";
import CollectionPage from "../../pages/plantcare/CollectionPage";

const CollectionContainer = () => {
  const [collection, setCollection] = useState({})
  const [allPlants, setAllPlants] = useState([])

  useEffect(() => {
    setAllPlants([
      {
        id: "1",
        name: "Dracaena",
        image: null
      },
      {
        id: "2",
        name: "Yucca",
        image: null
      },
      {
        id: "3",
        name: "Dracaena",
        image: ""
      },
      {
        id: "4",
        name: "Dracaena",
        image: ""
      },
      {
        id: "5",
        name: "Dracaena",
        image: ""
      },
      {
        id: "6",
        name: "Dracaena",
        image: ""
      },
      {
        id: "7",
        name: "Dracaena",
        image: ""
      },
      {
        id: "8",
        name: "Dracaena",
        image: ""
      },
      {
        id: "9",
        name: "Dracaena",
        image: ""
      },
      {
        id: "10",
        name: "Dracaena",
        image: ""
      },
      {
        id: "11",
        name: "Dracaena",
        image: ""
      }
    ]);
    setCollection({
      id: 1,
      image: null,
      name: 'Garden',
      description: 'This is place where I put my garden plants',
      plants: [
        {
          id: 1,
          image: null,
          nickname: "Yukica",
          referent: {name: "Yucca", id:"1"},
          tasks: [
            {
              id: "1",
              type: "watering",
              status: "WAITING", //waiting, done
              date: "03-05-2022",
              notes: "water a little bit more"
            },
            {
              id: "2",
              status: "WAITING",
              type: "fungicide",
              date: "03-05-2022",
              notes: ""
            }
          ]
        },
        {
          id: 2,
          image: null,
          nickname: "Dracenica",
          referent: {name: "Dracaena", id:"2"},
          tasks: [
            {
            id: "3",
            type: "watering",
            status: "DONE", //waiting, done
            date: "03-05-2022",
            notes: "water a little bit more"
          },]
        },
        {
          referent: {name: "Elephant plant", id: "3"},
          id: 3,
          image: null,
          nickname: "Slonce",
          tasks: []
        }
      ]
    })
  }, [])

  const addTaskHandler = (task) => {
    console.log('task iz containera ', task)
  }

  return (
    <CollectionContext.Provider value={{collection, allPlants, addTaskHandler}}>
      <CollectionPage/>
    </CollectionContext.Provider>
  )
}

export default CollectionContainer;