import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import CreatePlantContainer from './containers/CreatePlantContainer'
import PlantsContainer from './containers/PlantsContainer'
import Header from './components/Header';
import CategoriesContainer from './containers/CategoriesContainer';
import UpdatePlantContainer from './containers/UpdatePlantContainer';
import PlantContainer from './containers/PlantContainer';
import NotFoundPage from './pages/NotFoundPage';

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
          <Route path="/404" element={<NotFoundPage/>} />
        </Routes>
      {/* </Container> */}
    </div>
  );
}

export default App;
