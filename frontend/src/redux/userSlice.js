import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "./apiCalls";

// Define initial state
const initialState = {
  user: {
    firstName: "",
    lastName: "",
    accessLevel: null,
    profileImage: null,
  },
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoginRequest: (state) => {
      state.loading = true;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.user = {
        ...action.payload,
        accessLevel: action.payload.accessLevel,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
      state.error = null;
      state.isAuthenticated = true;
    },
    userLoginFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    userRegisterRequest: (state) => {
      state.loading = true;
    },
    userRegisterSuccess: (state, action) => {
      state.loading = false;
      state.user = {
        ...action.payload,
        accessLevel: action.payload.accessLevel,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
      state.error = null;
    },
    userRegisterFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    userLogoutRequest: (state) => {
      state.loading = true;
    },
    userLogoutSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.isAuthenticated = false;
    },
    userLogoutFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    userProfileUpdateRequest: (state) => {
      state.loading = true;
    },
    userProfileUpdateSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    userProfileUpdateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileImage: (state, action) => {
      state.user.profileImage = action.payload;
    },
    getUsersRequest: (state) => {
      state.loading = true;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    },
    getUsersFailure: (state, action) => {
      state.loading = false;
      state.users = [];
      state.error = action.payload;
    },
    checkAdminAccess: (state) => {
      const isAdmin = state.user && state.user.isAdmin;
      state.isAuthenticated = isAdmin;
    },
  },
});

export const registerUserRequest = (user) => async (dispatch) => {
  try {
    dispatch(userRegisterRequest());
    const userData = {
      ...user,
      accessLevel: Number(user.accessLevel),
    };
    await registerUser(userData);
    dispatch(userRegisterSuccess(userData)); // Pass the updated userData
  } catch (error) {
    dispatch(userRegisterFailure(error.message));
  }
};

// Export actions
export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFailure,
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFailure,
  userLogoutRequest,
  userLogoutSuccess,
  userLogoutFailure,
  userProfileUpdateRequest,
  userProfileUpdateSuccess,
  userProfileUpdateFailure,
  updateProfileImage,
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  checkAdminAccess,
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
