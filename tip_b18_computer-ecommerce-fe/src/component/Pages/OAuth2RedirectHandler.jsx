import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      alert("Đăng nhập bằng Google thành công!");
      navigate("/HomePage");
    } else {
      alert("Đăng nhập bằng Google thất bại!");
      navigate("/Login");
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập Google...</p>;
};

export default OAuth2RedirectHandler;
