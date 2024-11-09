import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import '../Styles/gallery.css';

// Import slick-carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);     // Error state

    useEffect(() => {
        axios.get('http://localhost:8080/api/movies/image')
            .then(response => {
                console.log('Images response:', response.data);
                setImages(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                setImages([]);
                setError('Error fetching images.');
                setLoading(false);
            });
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4, 
        slidesToScroll: 1, // Set to 1 for smooth dragging
        draggable: true,   // Enable dragging
        swipeToSlide: true, // Allow swipe to any slide
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1, // Adjusted to 1
                    draggable: true,
                    swipeToSlide: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1, // Adjusted to 1
                    draggable: true,
                    swipeToSlide: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1, // Adjusted to 1
                    draggable: true,
                    swipeToSlide: true,
                }
            }
        ]
    };

    return (
        <div className="gallery-container">
            <h2>Movies in Theaters</h2>
            {loading ? (
                <p>Loading movies...</p>
            ) : error ? (
                <p>{error}</p>
            ) : images.length > 0 ? (
                <Slider {...settings}>
                    {images.map((image, index) => (
                        <div key={index} className="movie-card">
                            <img 
                                src={`data:image/jpeg;base64,${image}`} 
                                alt={`Movie ${index}`} 
                            />
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
