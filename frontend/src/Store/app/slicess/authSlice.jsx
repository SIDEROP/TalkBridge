import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
let { VITE_API_URL } = import.meta.env;

// Base URL for API calls
// const API_URL = VITE_API_URL || "http://localhost:4000/api/v1"
const API_URL = "https://talkbridge.onrender.com/api/v1"

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, email, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${API_URL}/logout`, { withCredentials: true });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Async thunk for OTP generation
export const generateOtp = createAsyncThunk(
  "auth/generateOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/generateOtp`,
        { email },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP generation failed"
      );
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verifyOtp`, otpData, {
        withCredentials: true,
      });
      const token = response.data?.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Async thunk for re-login
export const reloginUser = createAsyncThunk(
  "auth/reloginUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const authToken = token || localStorage.getItem("auth_token");
      const response = await axios.get(`${API_URL}/relogin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });

      return response.data?.data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Re-login failed"
      );
    }
  }
);

// Async thunk fo rregister
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, name }, { rejectWithValue }) => {
    console.log(email, name);
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        { email, name },
        { withCredentials: true }
      );
      const token = response.data?.data?.auth_token;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Re-login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: {
      authenticated: false,
      loading: false,
      error: null,
      userData: null,
      token: null,
    },
    otpVerification: {
      loading: false,
      error: null,
      success: false,
      alredy: false,
    },
    otpGeneration: {
      loading: false,
      error: null,
      success: false,
    },
    register: {
      loading: false,
      error: null,
      data: null,
      success: false,
    },
    allUsers: {
      loading: false,
      error: null,
      users: null,
    },
  },
  reducers: {
    resetAuth: (state) => {
      state.auth = {
        authenticated: false,
        loading: false,
        error: null,
        userData: null,
      };
    },
    allUsersSet: (state, action) => {
      const currentUserId = state.auth.userData?._id;
      state.allUsers.users = action.payload?.filter(
        (user) => user.id !== currentUserId
      );
    },
  },
  extraReducers: (builder) => {
    // Login handlers
    builder
      .addCase(loginUser.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.auth.authenticated = true;
        state.auth.userData = action.payload;
        state.auth.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.auth.error = action.payload;
        state.auth.loading = false;
      });

    // Logout handlers
    builder
      .addCase(logoutUser.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.auth.authenticated = false;
        state.auth.userData = null;
        state.auth.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.auth.error = action.payload;
        state.auth.loading = false;
      });

    // OTP generation handlers
    builder
      .addCase(generateOtp.pending, (state) => {
        state.otpGeneration.loading = true;
        state.otpGeneration.error = null;
      })
      .addCase(generateOtp.fulfilled, (state) => {
        state.otpGeneration.success = true;
        state.otpGeneration.loading = false;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.otpGeneration.error = action.payload;
        state.otpGeneration.loading = false;
      });

    // OTP verification handlers
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.otpVerification.loading = true;
        state.otpVerification.error = null;
        state.otpVerification.alredy = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.auth.authenticated = action.payload.user;
        state.otpVerification.success = true;
        state.otpVerification.loading = false;
        state.otpVerification.alredy = action.payload.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpVerification.error = action.payload;
        state.otpVerification.loading = false;
      });

    // Re-login handlers
    builder
      .addCase(reloginUser.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(reloginUser.fulfilled, (state, action) => {
        state.auth.authenticated = true;
        state.auth.userData = action.payload;
        state.auth.loading = false;
      })
      .addCase(reloginUser.rejected, (state, action) => {
        state.auth.error = action.payload;
        state.auth.loading = false;
      });
    // register handlers
    builder
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.success = true;
        state.register.data = action.payload;
        state.register.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.error = action.payload;
        state.register.loading = false;
      });
  },
});

export const { resetAuth, allUsersSet } = authSlice.actions;

export default authSlice.reducer;
