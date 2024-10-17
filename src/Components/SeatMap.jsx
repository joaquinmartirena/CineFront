// SeatMap.jsx
import React, { useState, useEffect } from 'react';
import '../Styles/seatMap.css';

function SeatMap({ numSeats, selectedSeats, onSeatSelection }) {
  // Simulate fetching occupied seats from the database
    const occupiedSeats = ['A1', 'B5', 'C10', 'D3', 'E7']; // Example occupied seats

    // Generate seat labels (e.g., A1, A2, ..., O10)
    const rows = 15;
    const seatsPerRow = 10;
    const rowLabels = 'ABCDEFGHIJKLMNO'.split('');
    const allSeats = [];

    for (let i = 0; i < rows; i++) {
    const row = rowLabels[i];
    for (let j = 1; j <= seatsPerRow; j++) {
        allSeats.push(`${row}${j}`);
    }
    }

    const [availableSeats, setAvailableSeats] = useState([]);

    useEffect(() => {
    // In a real app, fetch the occupied seats for the selected cinema, movie, schedule, and hall
    const available = allSeats.filter((seat) => !occupiedSeats.includes(seat));
    setAvailableSeats(available);
    }, []);

    const [currentSelection, setCurrentSelection] = useState(selectedSeats);

    const handleSeatClick = (seat) => {
    if (occupiedSeats.includes(seat)) return;

    let newSelection = [...currentSelection];
    if (newSelection.includes(seat)) {
        newSelection = newSelection.filter((s) => s !== seat);
    } else {
        if (newSelection.length < numSeats) {
        newSelection.push(seat);
        } else {
        alert(`Solo puedes seleccionar ${numSeats} asientos.`);
        return;
        }
    }
    setCurrentSelection(newSelection);
    onSeatSelection(newSelection);
    };

    return (
    <div className="seat-map">
        <h2>Selecciona tus asientos</h2>
        <div className="screen">Pantalla</div>
        <div className="seats-container">
        {rowLabels.slice(0, rows).map((row) => (
            <div key={row} className="seat-row">
            {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatLabel = `${row}${i + 1}`;
                const isOccupied = occupiedSeats.includes(seatLabel);
                const isSelected = currentSelection.includes(seatLabel);
                return (
                <div
                    key={seatLabel}
                    className={`seat ${isOccupied ? 'occupied' : ''} ${
                    isSelected ? 'selected' : ''
                    }`}
                    onClick={() => handleSeatClick(seatLabel)}
                >
                    {seatLabel}
                </div>
                );
            })}
            </div>
        ))}
        </div>
        <div className="legend">
        <div>
            <span className="seat available"></span> Disponible
        </div>
        <div>
            <span className="seat selected"></span> Seleccionado
        </div>
        <div>
            <span className="seat occupied"></span> Ocupado
        </div>
        </div>
    </div>
    );
}

export default SeatMap;
