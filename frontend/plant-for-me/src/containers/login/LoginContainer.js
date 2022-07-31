import React from "react";
import { LoginContext } from '../../context/login/LoginContext'
import LoginPage from "../../pages/login/LoginPage";
import { AuthService } from "../../services/auth/AuthService";

const LoginContainer = () => {

  const loginHandler = (userCredentials) => {
    const login = AuthService.login(userCredentials)
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
      .catch(err => {
        console.log('err: ',err)
      })
    
      return login;
  }

  return (
    <LoginContext.Provider value={{loginHandler}}>
      <LoginPage />
    </LoginContext.Provider>
  )
}

export default LoginContainer;