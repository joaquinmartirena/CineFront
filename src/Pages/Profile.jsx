// Profile.jsx
import React, { useState, useEffect } from 'react';
import '../Styles/profile.css';

function Profile() {
  // State variables
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingReservationId, setCancellingReservationId] = useState(null);

    // Fetch user information and reservations when the component mounts
    useEffect(() => {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        // Handle the case where the user is not logged in
        setError(new Error('Por favor, inicia sesión para ver tu perfil.'));
        setLoading(false);
        return;
    }

    const fetchUserData = async () => {
        try {
        setLoading(true);

        // Fetch user details
        const userResponse = await fetch(
            `https://proyecto-tic-g4-h8a0.onrender.com/api/users/${encodeURIComponent(userId)}`
        );

        if (!userResponse.ok) {
            if (userResponse.status === 404) {
            // User not found (not registered)
            throw new Error('Usuario no registrado. Por favor, regístrate para acceder a tu perfil.');
            } else {
            throw new Error('Error al obtener los detalles del usuario');
            }
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user reservations
        const reservationsResponse = await fetch(
            `https://proyecto-tic-g4-h8a0.onrender.com/api/users/reservations?userId=${encodeURIComponent(userId)}`
        );

        if (reservationsResponse.ok) {
            const reservationsData = await reservationsResponse.json();
            setReservations(reservationsData);
        } else if (reservationsResponse.status === 404) {
            // No reservations found for the user
            setReservations([]); // Set reservations to an empty array
        } else {
            throw new Error('Error al obtener las reservas');
        }

        setLoading(false);
        } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
        }
    };

    fetchUserData();
    }, []);

    // Function to cancel a reservation
    const handleCancelReservation = async (reservationId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        try {
        setCancellingReservationId(reservationId); // Set the cancelling reservation ID
        const response = await fetch(
            `https://proyecto-tic-g4-h8a0.onrender.com/api/users/reservations?reservationId=${reservationId}`,
            {
            method: 'DELETE',
            }
        );

        if (!response.ok) {
            throw new Error('Error al cancelar la reserva');
        }

        // Remove the cancelled reservation from the state
        setReservations(reservations.filter((res) => res.reservationId !== reservationId));

        alert('Reserva cancelada con éxito.');
        } catch (err) {
        console.error(err);
        alert('Hubo un error al cancelar la reserva.');
        } finally {
        setCancellingReservationId(null); // Reset the cancelling reservation ID
        }
    }
    };

    // Helper function to format date-time strings
    function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const daysOfWeek = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
    ];
    const dayName = daysOfWeek[date.getDay()];

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDate = `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

    return `${dayName} ${formattedDate} ${formattedTime}`;
    }

    return (
    <div className="profile-page">
        {loading && <div>Cargando...</div>}
        {error && (
        <div className="error-message">
            {error.message}{' '}
            {error.message.includes('Por favor, inicia sesión') && (
            <a href="/login">Iniciar sesión</a>
            )}
            {error.message.includes('Usuario no registrado') && (
            <a href="/register">Regístrate aquí</a>
            )}
        </div>
        )}

        {!loading && !error && user && (
        <>
            <h1>
            Bienvenido, {user.name} {user.lastName}
            </h1>
            <h2>Tus Reservas</h2>
            {reservations.length > 0 ? (
            <table className="reservations-table">
                <thead>
                <tr>
                    <th>Código de Reserva</th>
                    <th>Película</th>
                    <th>Cine</th>
                    <th>Horario</th>
                    <th>Asientos</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((reservation) => (
                    <tr key={reservation.reservationId}>
                    <td>{reservation.reservationId}</td>
                    <td>{reservation.show.movie.movieId}</td>
                    <td>{reservation.show.hall.hallId.cinemaNumber}</td>
                    <td>{formatDateTime(reservation.show.showTime)}</td>
                    <td>
                        {reservation.tickets
                        .map((ticket) => `${ticket.seatRow}-${ticket.seatColumn}`)
                        .join(', ')}
                    </td>
                    <td>${reservation.total}</td>
                    <td>
                        <button
                        onClick={() => handleCancelReservation(reservation.reservationId)}
                        disabled={cancellingReservationId === reservation.reservationId}
                        >
                        {cancellingReservationId === reservation.reservationId
                            ? 'Cancelando...'
                            : 'Cancelar'}
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p>No tienes reservas actualmente.</p>
            )}
        </>
        )}
    </div>
    );
}

export default Profile;
