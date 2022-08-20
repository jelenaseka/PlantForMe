import React, { useEffect, useState } from "react";
import { UsersContext } from '../../context/users/UsersContext';
import UsersPage from '../../pages/users/UsersPage';
import { AuthService } from "../../services/auth/AuthService";
import { UserService } from "../../services/users/UserService";
import { useNavigate } from 'react-router-dom';
import { tokenIsExpired } from "../../utils/functions/jwt";

const UsersContainer = () => {
  const [users, setUsers] = useState([]);
  const currentUser = AuthService.getCurrentUser();
  let navigate = useNavigate();

  useEffect(() => {
    if(tokenIsExpired() || currentUser === null) {
      AuthService.logout();
      navigate("/login");
    }
    if(currentUser.role !== 2) {
      navigate("/404");
    }
    getAllHandler();
  }, [])

  const getAllHandler = () => {
    const getData = UserService.getUsers()
      .then(async res => {
        if(res.ok) {
          return res.json().then(data => setUsers(data));
        } else {
          const data = await res.text();
          return { ok: false, err: data };
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
        if(res.ok) {
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      });
    return createUser;
  }

  const updateUserHandler = (user) => {
    const updateUser = UserService.updateUser(user)
      .then(async res => {
        if(res.ok) {
          await res.text();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      });
    return updateUser;
  }

  const deleteUserHandler = (id) => {
    const deleteUser = UserService.deleteUser(id)
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
    return deleteUser;
  }

  return (
    <UsersContext.Provider value={
      {
        users,
        getAllHandler,
        createUserHandler,
        updateUserHandler,
        deleteUserHandler,
        currentUser
      }
    }>
      <UsersPage />
    </UsersContext.Provider>
  )
}

export default UsersContainer;