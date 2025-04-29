import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://deployapi-xw5c.onrender.com/api",
  //  baseURL: "http://192.168.199.49:8080/api",
  timeout: 10000,
});

//Interceptor cho request – tự động gắn token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

//Lỗi 401 thì xóa token + currentUser + về Login
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

// Gán token theo yêu cầu (nếu cần thủ công)
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
