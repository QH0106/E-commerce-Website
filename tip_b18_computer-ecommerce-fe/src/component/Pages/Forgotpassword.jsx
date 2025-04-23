import React, { useState } from "react";
import "../Css/Forgotpassword.css";

export const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email không được để trống!");
      return;
    }

    setMessage(`Một liên kết đặt lại mật khẩu đã được gửi tới ${email}`);
  };

  return (
    <>
    <div className="backgroundReset"></div>
      <div className="form-reset">
        <h2>Forgot Password</h2>

        <form onSubmit={handleResetPassword}>
        <div className="group">
          <label htmlFor="email">Email </label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

          <button type="submit">Send Reset Password</button>
        </form>

        {message && <p className="message">{message}</p>}

      <button><a href="/" style={{color:"#000", textDecoration:"none", textAlign:"center"}}>
      Quay lại</a>
      </button>
    </div>
  </>
  );
};

export default Forgotpassword;
