import apiRequest from "utils/api";

// Get all users
export const getAllUsers = async () => {
  return await apiRequest("/auth/all-users", {
    method: "GET",
  });
};
