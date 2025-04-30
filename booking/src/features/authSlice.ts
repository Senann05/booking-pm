// src/features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

// Login üçün API funksiyası
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/reservations');
      const userExists = response.data.some(
        (res: any) => res.email === credentials.email && res.name === credentials.name
      );
      
      if (!userExists) {
        throw new Error('İstifadəçi tapılmadı');
      }
      
      return { email: credentials.email, name: credentials.name };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Daxil etdiyiniz məlumatlar yanlışdır');
    }
  }
);

// Register üçün API funksiyası
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; reservationDate: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/reservations', userData);
      return { email: response.data.email, name: response.data.name };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;