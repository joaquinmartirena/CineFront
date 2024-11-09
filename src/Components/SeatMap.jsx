// SeatMap.jsx
import React, { useState, useEffect } from 'react';
import '../Styles/seatMap.css';

function SeatMap({ numSeats, selectedSeats, onSeatSelection, scheduleTime, cinemaId, movieId, onShowCodeFetched }) {
    const [seats, setSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSeatIds, setSelectedSeatIds] = useState(selectedSeats || []);

    // Helper function to convert row number to letter
    const getRowLetter = (rowNumber) => {
    const charCode = 'A'.charCodeAt(0) + rowNumber - 1;
    return String.fromCharCode(charCode);
    };

    useEffect(() => {
    // Fetch seat data when the component mounts
    setLoadingSeats(true);
    const url = `http://localhost:8080/api/shows/seats?movieId=${encodeURIComponent(movieId)}&cinemaNumber=${encodeURIComponent(cinemaId)}&showTime=${encodeURIComponent(scheduleTime)}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
        setSeats(data);
        setLoadingSeats(false);

        if (data.length > 0) {
            // Extract showCode from the first seat
            const showCode = data[0].id.showCode;
            // Call the callback to pass showCode back to parent
            if (onShowCodeFetched) {
            onShowCodeFetched(showCode);
            }
        } else {
            console.error('No seats data received');
            setError(new Error('No seats data received'));
        }
        })
        .catch((error) => {
        console.error('Error fetching seats:', error);
        setError(error);
        setLoadingSeats(false);
        });
    }, [movieId, cinemaId, scheduleTime]);

    // Handle seat click
    const handleSeatClick = (seat) => {
    if (!seat.available) {
        return; // Cannot select unavailable seats
    }
    const seatId = `${seat.id.seatRow}-${seat.id.seatColumn}`;

    let updatedSelectedSeats = [...selectedSeatIds];
    if (selectedSeatIds.includes(seatId)) {
        // Deselect the seat
        updatedSelectedSeats = updatedSelectedSeats.filter((id) => id !== seatId);
    } else {
        // Check if the number of selected seats is less than numSeats
        if (selectedSeatIds.length < numSeats) {
        updatedSelectedSeats.push(seatId);
        } else {
        alert(`Solo puedes seleccionar hasta ${numSeats} asientos.`);
        }
    }
    setSelectedSeatIds(updatedSelectedSeats);
    onSeatSelection(updatedSelectedSeats);
    };

    // Render the seat map
    const renderSeatMap = () => {
    // Create a 2D array to represent the seat map
    const seatMap = {};

    seats.forEach((seat) => {
        const row = seat.id.seatRow;
        const column = seat.id.seatColumn;
        if (!seatMap[row]) {
        seatMap[row] = {};
        }
        seatMap[row][column] = seat;
    });

    // Get sorted rows and columns
    const sortedRows = Object.keys(seatMap)
        .map(Number)
        .sort((a, b) => a - b);
    const sortedColumns = [...new Set(seats.map((seat) => seat.id.seatColumn))]
        .sort((a, b) => a - b);

    return (
        <div className="seat-map">
        <div className="screen">PANTALLA</div>
        {sortedRows.map((row) => (
            <div key={row} className="seat-row">
            {sortedColumns.map((column) => {
                const seat = seatMap[row][column];
                if (seat) {
                const seatId = `${seat.id.seatRow}-${seat.id.seatColumn}`;
                const isSelected = selectedSeatIds.includes(seatId);
                return (
                    <div
                    key={seatId}
                    className={`seat ${seat.available ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSeatClick(seat)}
                    >
                    {`${seat.id.seatColumn}${getRowLetter(seat.id.seatRow)}`}
                    </div>
                );
                } else {
                // Empty space if the seat doesn't exist
                return <div key={`${row}-${column}`} className="seat empty"></div>;
                }
            })}
            </div>
        ))}
        {/* Add the legend */}
        <div className="legend">
            <div>
            <div className="seat available"></div>
            <span>Disponible</span>
            </div>
            <div>
            <div className="seat selected"></div>
            <span>Seleccionado</span>
            </div>
            <div>
            <div className="seat unavailable"></div>
            <span>Ocupado</span>
            </div>
        </div>
        </div>
    );
    };

    return (
    <div className="seat-map-container">
        <h2>Selecciona tus Asientos</h2>
        {loadingSeats && <div>Cargando asientos...</div>}
        {error && <div>Error: {error.message}</div>}
        {!loadingSeats && !error && seats.length > 0 && renderSeatMap()}
        {!loadingSeats && !error && seats.length === 0 && <div>No hay asientos disponibles.</div>}
    </div>
    );
}

export default SeatMap;
