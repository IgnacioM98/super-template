import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const rootReducer = combineReducers({ auth: authReducer });
