import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    id: number;
    user_id: number;
    username: string;
    email: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    token: string;
  } | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export default authSlice.reducer;