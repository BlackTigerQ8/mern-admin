import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/userSlice";

// Custom middleware to protect the store
const protectStoreMiddleware = (store) => (next) => (action) => {
  const isAuthenticated = store.getState().user.isAuthenticated;
  const isAdmin = store.getState().user.isAdmin;

  if (!isAuthenticated) {
    // Handle unauthorized access here (e.g., redirect to login page)
    console.error("Unauthorized access to the store.");
    return;
  }

  if (action.meta && action.meta.requiresAdmin && !isAdmin) {
    // Handle unauthorized access to admin-only pages here
    console.error("Unauthorized access to admin-only page.");
    return;
  }

  // Proceed with the action
  return next(action);
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export default store;
