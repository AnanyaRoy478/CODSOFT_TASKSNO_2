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

export const createTask = async (taskData) => {
  return await apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (taskId, data) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: "PUT",
    body: data,
  });
};
