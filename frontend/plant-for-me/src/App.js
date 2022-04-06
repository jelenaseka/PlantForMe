import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import CreatePlantContainer from './containers/CreatePlantContainer'
import PlantsContainer from './containers/PlantsContainer'
import Header from './components/Header';
import CategoriesContainer from './containers/CategoriesContainer';
import PlantPage from './pages/PlantPage';

function App() {
  return (
    <div className="App">
      <Header></Header>
      {/* <Container maxWidth="lg"> */}
        <Routes>
          <Route path="/plants/create" element={<CreatePlantContainer/>}/>
          <Route path="/plants" element={<PlantsContainer/>}/>
          <Route path="/plants/:id" element={<PlantPage/>}/>
          <Route path="/categories" element={<CategoriesContainer/>}/>
        </Routes>
      {/* </Container> */}
    </div>
  );
}

export default App;
