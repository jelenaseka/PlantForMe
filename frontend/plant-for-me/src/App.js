import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import CreatePlantContainer from './containers/CreatePlantContainer'
import PlantsContainer from './containers/PlantsContainer'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/plants/create" element={<CreatePlantContainer/>}/>
        <Route path="/plants" element={<PlantsContainer/>}/>
      </Routes>
    </div>
  );
}

export default App;
