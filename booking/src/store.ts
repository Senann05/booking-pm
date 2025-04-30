import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import reservationReducer from './features/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;