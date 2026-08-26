import apiRequest from "utils/api";

// Get all projects
export const getProjects = async () => {
  return await apiRequest("/projects", {
    method: "GET",
  });
};

// Get single project
export const getProjectById = async (projectId) => {
  return await apiRequest(`/projects/${projectId}`, {
    method: "GET",
  });
};

// Create project
export const createProject = async (projectData) => {
  return await apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
};

// Update project
export const updateProject = async (projectId, projectData) => {
  return await apiRequest(`/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });
};

// Delete project
export const deleteProject = async (projectId) => {
  return await apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
  });
};
