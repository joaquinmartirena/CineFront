// SelectionPage.jsx
import React, { useState, useEffect } from 'react';
import SeatMap from '../Components/SeatMap';
import '../Styles/selectionPage.css';

function SelectionPage() {
  // Initial states
    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [availableMovies, setAvailableMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [numSeats, setNumSeats] = useState(1);
    const [showSeatMap, setShowSeatMap] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cinemas on component mount
    useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/cinemas')
        .then((response) => response.json())
        .then((data) => {
        setCinemas(data);
        setLoading(false);
        })
        .catch((error) => {
        console.error('Error fetching cinemas:', error);
        setError(error);
        setLoading(false);
        });
    }, []);

    // Handle cinema selection change
    const handleCinemaChange = (e) => {
        const ciNumber = parseInt(e.target.value, 10);
        const cinema = cinemas.find((c) => c.ciNumber === ciNumber);
        setSelectedCinema(cinema);
        setSelectedMovie(null);
        setAvailableSchedules([]);
        setSelectedSchedule(null);
        setShowSeatMap(false);
        setSelectedSeats([]);

        if (cinema) {
            // Fetch movies for the selected cinema
            setLoading(true);
            fetch(`http://localhost:8080/api/shows/cinema/${encodeURIComponent(ciNumber)}`)
            .then((response) => {
                if (response.ok) {
                return response.json();
                } else if (response.status === 404) {
                // No movies found for this cinema
                return [];
                } else {
                throw new Error(`Error fetching movies: ${response.statusText}`);
                }
            })
            .then((data) => {
                // Remove duplicates based on movieId
                const uniqueMoviesMap = new Map();
                data.forEach((movie) => {
                if (!uniqueMoviesMap.has(movie.movieId)) {
                    uniqueMoviesMap.set(movie.movieId, movie);
                }
                });
                const uniqueMovies = Array.from(uniqueMoviesMap.values());

                setAvailableMovies(uniqueMovies);
                setError(null); // Clear any previous errors
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
                setAvailableMovies([]); // Clear availableMovies in case of error
                setError(error);
                setLoading(false);
            });
        } else {
            setAvailableMovies([]);
        }
    };

    // Handle movie selection change
    const handleMovieChange = (e) => {
        const movieId = e.target.value; // movieId is a string
        const movie = availableMovies.find((m) => m.movieId === movieId);
        setSelectedMovie(movie);
        setSelectedSchedule(null);
        setShowSeatMap(false);
        setSelectedSeats([]);

        if (movie) {
            // Fetch schedules for the selected movie
            setLoading(true);
            fetch(`http://localhost:8080/api/shows/movie/${encodeURIComponent(movieId)}/schedules`)
            .then((response) => response.json())
            .then((data) => {
                setAvailableSchedules(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching schedules:', error);
                setError(error);
                setLoading(false);
            });
        } else {
            setAvailableSchedules([]);
        }
    };

    // Handle schedule selection change
    const handleScheduleChange = (e) => {
        const scheduleId = e.target.value; // Assuming scheduleId is a string
        const schedule = availableSchedules.find((s) => s.id === scheduleId);
        setSelectedSchedule(schedule);
        setShowSeatMap(false);
        setSelectedSeats([]);
    };

    // Handle number of seats change
    const handleNumSeatsChange = (e) => {
    setNumSeats(parseInt(e.target.value, 10));
    setSelectedSeats([]);
    };

    // Proceed to seat selection
    const handleProceedToSeatSelection = () => {
    setShowSeatMap(true);
    };

    // Handle seat selection
    const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
    };

    // Submit reservation to the backend
    const handleSubmit = (e) => {
    e.preventDefault();

    const reservationData = {
        cinemaId: selectedCinema.ciNumber,
        movieId: selectedMovie.movieId, // Use movieId instead of id
        scheduleId: selectedSchedule.id,
        seats: selectedSeats,
    };

    fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
    })
        .then((response) => response.json())
        .then((data) => {
        // Handle server response
        alert(`Reserva confirmada: ${JSON.stringify(data)}`);
        // Reset form if necessary
        })
        .catch((error) => {
        console.error('Error creating reservation:', error);
        setError(error);
        });
    };

    return (
    <div className="selection-page">
        <h1>Reserva tu Entrada</h1>
        {loading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!loading && !error && (
        <form onSubmit={handleSubmit}>
            {/* Select Cinema */}
            <div className="form-group">
            <label>Selecciona el Cine:</label>
            <select
                value={selectedCinema ? selectedCinema.ciNumber : ''}
                onChange={handleCinemaChange}
                required
            >
                <option value="">--Selecciona un Cine--</option>
                {cinemas.map((cinema) => (
                <option key={cinema.ciNumber} value={cinema.ciNumber}>
                    {cinema.neighborhood}
                </option>
                ))}
            </select>
            </div>

            {/* Select Movie */}
            {selectedCinema && (
            availableMovies.length > 0 ? (
                <div className="form-group">
                <label>Selecciona la Película:</label>
                <select
                    value={selectedMovie ? selectedMovie.movieId : ''}
                    onChange={handleMovieChange}
                    required
                >
                    <option value="">--Selecciona una Película--</option>
                    {availableMovies.map((movie) => (
                    <option key={movie.movieId} value={movie.movieId}>
                        {movie.movieId}
                    </option>
                    ))}
                </select>
                </div>
            ) : (
                <div className="no-movies">No movies available in this cinema.</div>
            )
            )}

            {/* Select Schedule */}
            {availableSchedules.length > 0 && (
            <div className="form-group">
                <label>Selecciona el Horario:</label>
                <select
                value={selectedSchedule ? selectedSchedule.id : ''}
                onChange={handleScheduleChange}
                required
                >
                <option value="">--Selecciona un Horario--</option>
                {availableSchedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                    {schedule.time}
                    </option>
                ))}
                </select>
            </div>
            )}

            {/* Number of Seats */}
            {selectedSchedule && (
            <div className="form-group">
                <label>¿Cuántos asientos deseas reservar?</label>
                <input
                type="number"
                min="1"
                max="10"
                value={numSeats}
                onChange={handleNumSeatsChange}
                required
                />
            </div>
            )}

            {/* Button to Select Seats */}
            {selectedSchedule && (
            <div className="button-container">
                <button type="button" onClick={handleProceedToSeatSelection}>
                Seleccionar Asientos
                </button>
            </div>
            )}

            {/* Seat Map */}
            {showSeatMap && selectedSchedule && (
            <SeatMap
                numSeats={numSeats}
                selectedSeats={selectedSeats}
                onSeatSelection={handleSeatSelection}
                scheduleId={selectedSchedule.id}
            />
            )}

            {/* Confirm Reservation */}
            {selectedSeats.length === numSeats && (
            <div className="button-container">
                <button type="submit">Confirmar Reserva</button>
            </div>
            )}
        </form>
        )}
    </div>
    );
}

export default SelectionPage;
