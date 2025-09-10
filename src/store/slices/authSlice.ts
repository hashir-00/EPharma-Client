import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI, usersAPI } from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  createdAt?: string;
  lastName?: string;
  age?: number;
  phone?: string;
  address?: string | null;
  prescriptions?: string[];
  isActive?: boolean;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(credentials);
      // Handle different possible response structures
      const data = response.data.data || response.data;
      const { user, token } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("sessionId", token);

      return { user, token };
    } catch (error: unknown) {
      let message = "Login failed";
      if (error && typeof error === "object") {
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          message = error.response.data.message;
        } else if ("message" in error && typeof error.message === "string") {
          message = error.message;
        }
      }
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(userData);
      // Handle different possible response structures
      const data = response.data.data || response.data;
      const { user: backendUser, token } = data;

      // Transform backend user data to frontend format
      const user: User = {
        ...backendUser,
        name:
          `${backendUser.firstName || ""} ${backendUser.lastName || ""}`.trim() ||
          backendUser.email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { user, token };
    } catch (error: unknown) {
      let message = "Registration failed";
      if (error && typeof error === "object") {
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          message = error.response.data.message;
        } else if ("message" in error && typeof error.message === "string") {
          message = error.message;
        }
      }
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, ) => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      return null;
    } catch (error: unknown) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("token");
      return null;
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateProfile(userData);
      const updatedUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Profile update failed";
      return rejectWithValue(message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getProfile();
      console.log("User Profile Data:", response.data);
      return response.data.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch user profile";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    // Keep old actions for compatibility with existing components
    loginStart: state => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get User Profile
      .addCase(getUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
