import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.199.43:8080/api", 
  timeout: 10000, 
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Interceptor cho response: Xử lý lỗi toàn cục
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Nếu lỗi 401 (Unauthorized), điều hướng người dùng về trang đăng nhập
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/Login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
