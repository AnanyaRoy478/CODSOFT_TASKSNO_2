// const API_URL = import.meta.env.REACT_APP_API_URL;

const API_URL = "https://codsoft-tasksno-2-3.onrender.com/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add JWT automatically for protected requests
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestBody =
    options.body !== undefined && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body;
  // console.log("TOKEN:", token);
  // console.log("REQUEST URL:", `${API_URL}${endpoint}`);
  // console.log("HEADERS:", headers);
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: requestBody,
  });

  // Try to parse JSON response
  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = {
      statusCode: response.status,
      flag: false,
      body: {
        message: "Invalid server response.",
        data: {},
      },
    };
  }

  // Handle unauthorized requests
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (!response.ok) {
    throw {
      status: response.status,
      response: data,
    };
  }

  return data;
};

export default apiRequest;
