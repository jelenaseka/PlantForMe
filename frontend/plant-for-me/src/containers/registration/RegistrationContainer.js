import React from "react";
import { RegistrationContext } from '../../context/registration/RegistrationContext';
import RegistrationPage from "../../pages/registration/RegistrationPage";
import { AuthService } from "../../services/auth/AuthService";

const RegistrationContainer = () => {

  const registerHandler = (newUser) => {
    const register = AuthService.register(newUser)
      .then(async res => {
        if(res.ok) {
          const data = await res.json();
          return { ok: true, err: null };
        } else {
          const data = await res.text();
          return { ok: false, err: data };
        }
      })
      .catch(err => {
        console.log('err: ',err)
      })
    
      return register;
  }

  return (
    <RegistrationContext.Provider value={{registerHandler}}>
      <RegistrationPage/>
    </RegistrationContext.Provider>
  )
}

export default RegistrationContainer;