// SelectionPage.jsx
import React, { useState } from 'react';
import SeatMap from '../Components/SeatMap';
import '../Styles/selectionPage.css';

function SelectionPage() {
    // Simulated database data
    const cinemas = ['Cinema 1', 'Cinema 2', 'Cinema 3'];
    const movies = {
    'Cinema 1': ['Movie A', 'Movie B'],
    'Cinema 2': ['Movie C', 'Movie D'],
    'Cinema 3': ['Movie E', 'Movie F'],
    };
    const schedules = {
    'Movie A': ['10:00 AM', '1:00 PM', '4:00 PM'],
    'Movie B': ['11:00 AM', '2:00 PM', '5:00 PM'],
    'Movie C': ['12:00 PM', '3:00 PM', '6:00 PM'],
    // Add schedules for other movies
    };

    const [selectedCinema, setSelectedCinema] = useState('');
    const [availableMovies, setAvailableMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [numSeats, setNumSeats] = useState(1);
    const [showSeatMap, setShowSeatMap] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleCinemaChange = (e) => {
    const cinema = e.target.value;
    setSelectedCinema(cinema);
    setAvailableMovies(movies[cinema] || []);
    setSelectedMovie('');
    setAvailableSchedules([]);
    setSelectedSchedule('');
    setShowSeatMap(false);
    setSelectedSeats([]);
    };

    const handleMovieChange = (e) => {
    const movie = e.target.value;
    setSelectedMovie(movie);
    setAvailableSchedules(schedules[movie] || []);
    setSelectedSchedule('');
    setShowSeatMap(false);
    setSelectedSeats([]);
    };

    const handleScheduleChange = (e) => {
    setSelectedSchedule(e.target.value);
    setShowSeatMap(false);
    setSelectedSeats([]);
    };

    const handleNumSeatsChange = (e) => {
    setNumSeats(parseInt(e.target.value, 10));
    setSelectedSeats([]);
    };

    const handleProceedToSeatSelection = () => {
    setShowSeatMap(true);
    };

    const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the reservation logic here
    alert(`Reserva confirmada:
    Cine: ${selectedCinema}
    Película: ${selectedMovie}
    Horario: ${selectedSchedule}
    Asientos: ${selectedSeats.join(', ')}`);
    };

    return (
    <div className="selection-page">
        <h1>Reserva tu Entrada</h1>
        <form onSubmit={handleSubmit}>
        {/* Select Cinema */}
        <div className="form-group">
            <label>Selecciona el Cine:</label>
            <select value={selectedCinema} onChange={handleCinemaChange} required>
            <option value="">--Selecciona un Cine--</option>
            {cinemas.map((cinema) => (
                <option key={cinema} value={cinema}>
                {cinema}
                </option>
            ))}
            </select>
        </div>

        {/* Select Movie */}
        {availableMovies.length > 0 && (
            <div className="form-group">
            <label>Selecciona la Película:</label>
            <select value={selectedMovie} onChange={handleMovieChange} required>
                <option value="">--Selecciona una Película--</option>
                {availableMovies.map((movie) => (
                <option key={movie} value={movie}>
                    {movie}
                </option>
                ))}
            </select>
            </div>
        )}

        {/* Select Schedule */}
        {availableSchedules.length > 0 && (
            <div className="form-group">
            <label>Selecciona el Horario:</label>
            <select value={selectedSchedule} onChange={handleScheduleChange} required>
                <option value="">--Selecciona un Horario--</option>
                {availableSchedules.map((schedule) => (
                <option key={schedule} value={schedule}>
                    {schedule}
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

        {/* Proceed to Seat Selection */}
        {selectedSchedule && (
            <div className="button-container">
            <button type="button" onClick={handleProceedToSeatSelection}>
                Seleccionar Asientos
            </button>
            </div>
        )}

        {/* Seat Map */}
        {showSeatMap && (
            <SeatMap
            numSeats={numSeats}
            selectedSeats={selectedSeats}
            onSeatSelection={handleSeatSelection}
            />
        )}

        {/* Confirm Reservation */}
        {selectedSeats.length === numSeats && (
            <div className="button-container">
            <button type="submit">Confirmar Reserva</button>
            </div>
        )}
        </form>
    </div>
    );
}

export default SelectionPage;
