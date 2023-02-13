import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { authenticationState, userDB } from "./authTypes";

// Define a type for the slice state
interface AuthState {
  authState: authenticationState;
  user: userDB | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  authState: "Unauthenticated",
  user: null,
};

export const authSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAuthState: (state, { payload }: PayloadAction<authenticationState>) => {
      state.authState = payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const authSelector = (state: RootState) => state.auth.authState;

export default authSlice.reducer;
