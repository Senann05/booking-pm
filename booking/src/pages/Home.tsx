import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations, addReservation, deleteReservation } from '../features/reservationSlice';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store'; // Import RootState from store
import './Home.css';

interface ReservationForm {
  name: string;
  email: string;
  reservationDate: string;
}

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { reservations, status, error } = useSelector((state: RootState) => state.reservations);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [newReservation, setNewReservation] = useState<ReservationForm>({
    name: '',
    email: user?.email || '',
    reservationDate: '',
  });

  useEffect(() => {
    dispatch(fetchReservations() as any); 
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
          setNewReservation(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addReservation(newReservation) as any); 
    setNewReservation({
      name: '',
      email: user?.email || '',
      reservationDate: '',
    });
  };

  const handleDelete = (id: string) => {
    // Dispatch the deleteReservation action
    dispatch(deleteReservation(id) as any); 
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <header className="header">
        <h1>Hotel Reservations</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="content">
        <div className="reservation-form">
          <h2>Add New Reservation</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newReservation.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newReservation.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Reservation Date:</label>
              <input
                type="datetime-local"
                name="reservationDate"
                value={newReservation.reservationDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Add Reservation
            </button>
          </form>
        </div>

        <div className="reservation-list">
          <h2>Current Reservations</h2>
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <ul>
              {reservations.map(reservation => (
                <li key={reservation.id} className="reservation-item">
                  <div>
                    <strong>{reservation.name}</strong>
                    <p>Email: {reservation.email}</p>
                    <p>Date: {new Date(reservation.reservationDate).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;