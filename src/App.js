
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header'; 
import Inicio from './Inicio';
import Qsomos from './Qsomos';
import Prodf from './Prodf';
import Contacto from './Contacto';

function App() {
  return (
    <Router>
      <Header /> 

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/qsomos" element={<Qsomos />} />
        <Route path="/prodf" element={<Prodf />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </Router>
  );
}

export default App;
