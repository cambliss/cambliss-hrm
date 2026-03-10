import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
