import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from '../../context/login/LoginContext'
import LoginPage from "../../pages/login/LoginPage";
import { AuthService } from "../../services/auth/AuthService";

const LoginContainer = () => {
  let navigate = useNavigate();

  const loginHandler = (userCredentials) => {
    console.log(userCredentials)

    AuthService.login(userCredentials)
      .then(res => {
        if(res.status >= 400 && res.status < 500) {
          return res.text().then(data => console.log(data));
        } else {
          
          return res.json().then(data => {
            // console.log(data.token)
            // data.token = data.token.slice(1, -2);
            localStorage.setItem("user", JSON.stringify(data))
            return navigate("/users");
          });
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
  }

  return (
    <LoginContext.Provider value={{loginHandler}}>
      <LoginPage />
    </LoginContext.Provider>
  )
}

export default LoginContainer;