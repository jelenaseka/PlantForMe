import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import CreatePlantContainer from './containers/plants/CreatePlantContainer'
import PlantsContainer from './containers/plants/PlantsContainer'
import Header from './utils/components/Header';
import CategoriesContainer from './containers/plants/CategoriesContainer';
import UpdatePlantContainer from './containers/plants/UpdatePlantContainer';
import PlantContainer from './containers/plants/PlantContainer';
import NotFoundPage from './utils/pages/NotFoundPage';
import UsersContainer from './containers/users/UsersContainer';
import LoginContainer from './containers/login/LoginContainer';
import ForumsContainer from './containers/forums/ForumsContainer';
import ForumPostContainer from './containers/forums/ForumPostContainer';
import { ThemeProvider } from '@emotion/react';
import { theme } from './assets/theme/theme';
import 'react-toastify/dist/ReactToastify.css';
import RegistrationContainer from './containers/registration/RegistrationContainer';
import ProfileContainer from './containers/profile/ProfileContainer';
import PlantCareContainer from './containers/plant-care/PlantCareContainer';
import CollectionContainer from './containers/plant-care/CollectionContainer';
import CollectionPlantContainer from './containers/plant-care/CollectionPlantContainer';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <Header></Header>
        <Routes>
          <Route path="/plants/create" element={<CreatePlantContainer/>}/>
          <Route path="/plants/update/:id" element={<UpdatePlantContainer/>}/>
          <Route path="/plants" element={<PlantsContainer/>}/>
          <Route path="/plants/:id" element={<PlantContainer/>}/>
          <Route path="/categories" element={<CategoriesContainer/>}/>
          <Route path="/users" element={<UsersContainer/>}/>
          <Route path="/forums" element={<ForumsContainer/>}/>
          <Route path="/forums/:id" element={<ForumPostContainer/>}/>
          <Route path="/plantcare" element={<PlantCareContainer/>}/>
          <Route path="/plantcare/:id" element={<CollectionContainer/>}/>
          <Route path="/plantcare/:collectionid/plant/:plantid" element={<CollectionPlantContainer/>}/>
          <Route path="/login" element={<LoginContainer/>}/>
          <Route path="/registration" element={<RegistrationContainer/>}/>
          <Route path='/me' element={<ProfileContainer/>}/>
          <Route path="/404" element={<NotFoundPage/>} />
        </Routes>
      </ThemeProvider>
     
    </div>
  );
}

export default App;
