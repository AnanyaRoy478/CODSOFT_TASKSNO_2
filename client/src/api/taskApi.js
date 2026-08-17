import apiRequest from "utils/api";

// Get all tasks
export const getTasks = async () => {
  return await apiRequest("/tasks", {
    method: "GET",
  });
};

// Get task by ID
export const getTaskById = async (taskId) => {
  return await apiRequest(`/tasks/${taskId}`, {
    method: "GET",
  });
};
