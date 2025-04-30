import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Reservation {
  id: string;
  name: string;
  email: string;
  reservationDate: string;
}

interface ReservationState {
  reservations: Reservation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  status: 'idle',
  error: null,
};

const API_URL = 'http://localhost:8080/api/reservations';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addReservation = createAsyncThunk(
  'reservations/addReservation',
  async (newReservation: Omit<Reservation, 'id'>) => {
    const response = await axios.post(API_URL, newReservation);
    return response.data;
  }
);

export const deleteReservation = createAsyncThunk(
  'reservations/deleteReservation',
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action: PayloadAction<Reservation[]>) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reservations';
      })
      .addCase(addReservation.fulfilled, (state, action: PayloadAction<Reservation>) => {
        state.reservations.push(action.payload);
      })
      .addCase(deleteReservation.fulfilled, (state, action: PayloadAction<string>) => {
        state.reservations = state.reservations.filter(res => res.id !== action.payload);
      });
  },
});

export default reservationSlice.reducer;