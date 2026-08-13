import apiRequest from "utils/api";

// Login
export const loginUser = async (credentials) => {
  return await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// Register
export const registerUser = async (userData) => {
  return await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// Get profile
export const getProfile = async () => {
  return await apiRequest("/auth/profile", {
    method: "GET",
  });
};

// Update profile
export const updateProfile = async (userData) => {
  return await apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};