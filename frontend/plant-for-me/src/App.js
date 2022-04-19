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

function App() {
  return (
    <div className="App">
      <Header></Header>
      {/* <Container maxWidth="lg"> */}
        <Routes>
          <Route path="/plants/create" element={<CreatePlantContainer/>}/>
          <Route path="/plants/update/:id" element={<UpdatePlantContainer/>}/>
          <Route path="/plants" element={<PlantsContainer/>}/>
          <Route path="/plants/:id" element={<PlantContainer/>}/>
          <Route path="/categories" element={<CategoriesContainer/>}/>
          <Route path="/users" element={<UsersContainer/>}/>
          <Route path="/login" element={<LoginContainer/>}/>
          <Route path="/404" element={<NotFoundPage/>} />
        </Routes>
      {/* </Container> */}
    </div>
  );
}

export default App;
