import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import '../Styles/gallery.css';

// Import slick-carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function Gallery() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('/api/movies')
            .then(response => {
                console.log('Movies response:', response.data);
                setMovies(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                setMovies([]);
            });
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Show 4 images at a time
        slidesToScroll: 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="gallery-container">
            <h2>Movies in Theaters</h2>
            {movies.length > 0 ? (
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img src={movie.image} alt={movie.name} />
                            <p>{movie.name}</p>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>No movies available</p>
            )}
        </div>
    );
}

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
