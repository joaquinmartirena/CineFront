// Home.js
import React, { useState, useEffect } from 'react';
import '../Styles/home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const images = [
        '/Images/toystory.jpeg',
        '/Images/Dune.jpeg',
        '/Images/rapidos-y-furiosos-11.jpg',
        '/Images/scale.jpeg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Cambia de imagen cada 3 segundos

        return () => clearInterval(interval);
    }, [images.length]);

    const handleReservationClick = () => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            // User is logged in, navigate to the reservation page
            navigate('/select-cinema');
        } else {
            // User is not logged in, navigate to the login page
            navigate('/login', { state: { from: '/select-cinema' } });
        }
    };

    return (
        <div className="home-container">
            <div
                className="slideshow"
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            >
                <div className="overlay">
                    <h1>Bienvenidos a What The Fun</h1>
                    <p>La mejor experiencia del cine</p>
                    <button onClick={handleReservationClick}>Reservar Ahora</button>
                </div>
            </div>
            <div className="info-section">
                <h2>Nuestra Ubicación</h2>
                <p>
                    Estamos ubicados en el corazón de la ciudad, en la Avenida Principal 1234.
                    Ofrecemos las últimas películas en cartelera con la mejor calidad de imagen y sonido.
                    ¡Ven y vive una experiencia inolvidable!
                </p>
            </div>
        </div>
    );
}

export default Home;
