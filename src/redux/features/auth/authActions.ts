import { createAsyncThunk } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";

export const validateAuth = createAsyncThunk(
  "auth/validate",
  (_, { dispatch }) => {
    dispatch(authSlice.actions.setAuthState("Authenticated"));
  }
);

export const restoreAuth = createAsyncThunk(
  "auth/validate",
  (_, { dispatch }) => {
    dispatch(authSlice.actions.setAuthState("Unauthenticated"));
  }
);
