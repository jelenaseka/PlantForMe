import React from "react";
import { LoginContext } from '../../context/login/LoginContext'
import LoginPage from "../../pages/login/LoginPage";
import { AuthService } from "../../services/auth/AuthService";

const LoginContainer = () => {

  const loginHandler = (userCredentials) => {
    const login = AuthService.login(userCredentials)
      .then(async res => {
        if(res.status >= 400 && res.status < 500) {
          const data = await res.text();
          return { ok: false, err: data };
        } else {
          return res.json().then(data => {
            localStorage.setItem("user", JSON.stringify(data))
            return { ok: true, err: null };
          });
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