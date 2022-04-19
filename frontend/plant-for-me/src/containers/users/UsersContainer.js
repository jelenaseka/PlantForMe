import React, { useEffect, useState } from "react";
import { UsersContext } from '../../context/users/UsersContext'
import UsersPage from '../../pages/users/UsersPage'
import { UserService } from "../../services/users/UserService"

const UsersContainer = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getAllHandler()
  }, [])

  const getAllHandler = () => {
    const getData = UserService.getUsers()
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          return res.json().then(data => {
            setUsers(data);
            return { ok: true, err: null };
          });
          
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
    return getData;
  }

  const createUserHandler = (user) => {
    const createUser = UserService.createUser(user)
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          await res.text();
          return { ok: true, err: null };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })

    return createUser;
  }

  const updateUserHandler = (user) => {
    
    const updateUser = UserService.updateUser(user)
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          await res.text();
          return { ok: true, err: null };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })

    return updateUser;
    
  }

  const deleteUserHandler = (id) => {
    const deleteUser = UserService.deleteUser(id)
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          await res.text();
          return { ok: true, err: null };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
      return deleteUser;
  }

  return (
    <UsersContext.Provider value={{users, getAllHandler,createUserHandler, updateUserHandler, deleteUserHandler}}>
      <UsersPage />
    </UsersContext.Provider>
  )
}

export default UsersContainer;