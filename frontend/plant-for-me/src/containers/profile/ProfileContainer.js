import React, { useEffect, useState } from "react";
import { ProfileContext } from '../../context/profile/ProfileContext';
import ProfilePage from "../../pages/profile/ProfilePage";
import { AuthService } from "../../services/auth/AuthService";
import { useNavigate } from 'react-router-dom';
import { tokenIsExpired } from "../../utils/functions/jwt";

const ProfileContainer = () => {
  const [me, setMe] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    if(tokenIsExpired()) {
      AuthService.logout();
      return navigate("/login");
    }
    handleGetMe();
  }, [])

  const handleGetMe = () => {
    const getMe = AuthService.getMe().then(async res => {
      if(res.ok) {
        const data = await res.json();
        setMe(data);
      } else {
        navigate("/login");
      }
    }).catch(err => console.log(err))

    return getMe;
  }

  const changeUsernameHandler = (username) => {
    let user = {newUsername: username};
    const changeUsername = AuthService.changeUsername(user)
      .then(async res => {
        if(res.ok) {
          return res.json().then(data => {
            localStorage.setItem("user", JSON.stringify(data))
            return { ok: true, err: null, user: data };
          });
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
    
      return changeUsername;
  }

  const changePasswordHandler = (password) => {
    let user = {newPassword: password};
    const changePassword = AuthService.changePassword(user)
      .then(async res => {
        if(res.ok) {
          return { ok: true, err: null};
        } else {
          const data = await res.text();
          return { ok: false, err: data};
        }
      });

      return changePassword;
  }

  return (
    <ProfileContext.Provider value={{me, changeUsernameHandler, changePasswordHandler}}>
      <ProfilePage/>
    </ProfileContext.Provider>
  )
}

export default ProfileContainer;