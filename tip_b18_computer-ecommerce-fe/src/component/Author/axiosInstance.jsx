import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://25.18.19.146:8080/api",
  // baseURL: "http://25.17.83.25:8080/api",

  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Chỉ set Content-Type nếu không phải là FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ");
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);

// Hàm gán token thủ công nếu cần
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
