import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Cartelera from './Pages/Cartelera.jsx';
import Navbar from './Components/Navbar.jsx';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cartelera" element={<Cartelera/>}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App;