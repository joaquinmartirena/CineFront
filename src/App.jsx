import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Billboard from './Pages/Billboard.jsx';
import Navbar from './Components/Navbar.jsx';
import SelectionPage from './Pages/SelectionPage.jsx';

function App() {
  // Utiliza useLocation para obtener la ruta actual
  const location = useLocation();

  return (
    <div className='App'>
      {/* Renderiza el Navbar solo si no estás en la ruta "/login" */}
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cartelera" element={<Billboard />} />
        <Route path="/select-cinema" element={<SelectionPage/>} />
      </Routes>
    </div>
  );
}

// Se necesita crear un componente AppWrapper que envuelve App con Router para que useLocation funcione correctamente
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
