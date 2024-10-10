// Gallery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import '../Styles/gallery.css'; // Archivo CSS para estilos

function Gallery() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('/api/movies')
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
    }, []);

    // Carousel settings
    const settings = {
        dots: false,
        infinite: true, // Loop through items
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="gallery-container">
            <h2>Movies in Theaters</h2>
            <Slider {...settings}>
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <img src={movie.image} alt={movie.name} />
                        <p>{movie.name}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

// Custom arrow components
function NextArrow(props) {
    const { onClick } = props;
    return (
        <div className="arrow next" onClick={onClick}>
            &#10095;
        </div>
    );
}

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="arrow prev" onClick={onClick}>
            &#10094;
        </div>
    );
}

export default Gallery;
