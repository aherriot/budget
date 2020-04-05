import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer
  // middleware,
  // devTools: process.env.NODE_ENV !== 'production',
  // preloadedState
});

export default store;
