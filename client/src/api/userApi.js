import apiRequest from "utils/api";

// Get all users
export const getAllUsers = async () => {
  return await apiRequest("/auth/all-users", {
    method: "GET",
  });
};

export const registerUser = async (userData) => {
  return apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (userId, userData) => {
  return apiRequest(`/auth/profile/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};
