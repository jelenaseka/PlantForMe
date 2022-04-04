import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import CreatePlantContainer from './containers/CreatePlantContainer'
import PlantsContainer from './containers/PlantsContainer'
import Header from './components/Header';
import { Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Header></Header>
      {/* <Container maxWidth="lg"> */}
        <Routes>
          <Route path="/plants/create" element={<CreatePlantContainer/>}/>
          <Route path="/plants" element={<PlantsContainer/>}/>
        </Routes>
      {/* </Container> */}
    </div>
  );
}

export default App;
