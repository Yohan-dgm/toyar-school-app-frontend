import axios from "axios";

// Mock sample data since the file doesn't exist
const sampleUserData = {
  users: [],
  total: 0,
};

const API_BASE_URL = "https://your-api-base-url.com"; // Replace with your API URL

export const getUserListData = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/user-management/user/get-user-list-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: userId },
      },
    );
    return response.data || sampleUserData;
  } catch (error) {
    console.error("API Error:", error);
    return sampleUserData;
  }
};
