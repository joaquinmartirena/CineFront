// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Styles/navbar.css"; 

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Function to check login status
        const checkLoginStatus = () => {
            const userId = sessionStorage.getItem('userId');
            setIsLoggedIn(!!userId);
        };

        // Check login status on component mount
        checkLoginStatus();

        // Listen for custom login status change events
        window.addEventListener('loginStatusChanged', checkLoginStatus);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        // Remove userId from sessionStorage
        sessionStorage.removeItem('userId');
        setIsLoggedIn(false);

        // Dispatch custom event to inform other components
        const loginEvent = new Event('loginStatusChanged');
        window.dispatchEvent(loginEvent);

        // Redirect to home page or login page
        navigate('/');
    };

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
                    {isLoggedIn ? (
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;

