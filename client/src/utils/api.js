// const API_URL = import.meta.env.REACT_APP_API_URL;

const API_URL = "http://localhost:5000/api";

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
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
