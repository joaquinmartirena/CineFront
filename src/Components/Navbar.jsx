// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import "../Styles/navbar.css"; 

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">WTF</div>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/cartelera">Cartelera</Link>
                </li>
                <li>
                    <Link to="/Profile">Profile</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
