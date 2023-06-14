import axios from "axios";

const USERS_URL = "/api/users";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${USERS_URL}/auth`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const isAdminUser = async (email, password) => {
  try {
    const response = await axios.get(`${USERS_URL}/auth`);
    const { isAdmin } = response.data; // Extract the isAdmin property from the response
    return { isAdmin }; // Return the isAdmin status
  } catch (error) {
    throw error.response.data.message;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${USERS_URL}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${USERS_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${USERS_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${USERS_URL}`);
    const users = response.data;

    // Add the `fullName` property to each user object
    const usersWithFullName = users.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    }));

    return usersWithFullName;
  } catch (error) {
    throw error.response.data.message;
  }
};
