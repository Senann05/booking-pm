// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/authSlice';
import './Auth.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, name, reservationDate }) as any);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Qeydiyyat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Ad:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Rezervasiya tarixi:</label>
            <input
              type="datetime-local"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Qeydiyyat</button>
        </form>
        <p className="auth-toggle">
          Hesabınız var? <span onClick={() => navigate('/')}>Daxil olun</span>
        </p>
      </div>
    </div>
  );
};

export default Register;