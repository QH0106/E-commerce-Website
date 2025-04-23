import React, { useState } from "react";
import { Container, Button, Form, Image } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, total, orderId, paymentStatus } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(
    paymentStatus === "UNPAID" ? "QRCODE" : "COD"
  );

  const handlePayment = () => {
    if (paymentMethod === "COD") {
      alert("Đặt hàng thành công (COD)!");
    } else {
      alert("Vui lòng quét mã QR để thanh toán.");
    }
  };


  return (
    <Container className="py-5">
      <a href="/Cart" onClick={() => navigate(-1)} style={{ textDecoration: "underline" }}>
        &larr; Quay lại
      </a>

      <h5 className="mt-3">Thông tin đặt hàng</h5>
      <ul>
        <li><strong>Khách hàng:</strong> {customer?.name}</li>
        <li><strong>Số điện thoại:</strong> {customer?.phone}</li>
        <li><strong>Địa chỉ nhận hàng:</strong> {customer?.address}</li>
        <li><strong>Phí vận chuyển:</strong> Miễn Phí</li>
        <li><strong>Tổng tiền:</strong> {total?.toLocaleString()}₫</li>
      </ul>

      <p><strong>Chọn hình thức thanh toán</strong></p>
      <Form.Check 
        type="radio"
        label="Thanh toán khi giao hàng (COD)"
        name="payment"
        checked={paymentMethod === "COD"}
        onChange={() => setPaymentMethod("COD")}
        className="mb-2"
      />
      <Form.Check 
        type="radio"
        label="Thanh toán qua thẻ ngân hàng (QR Code)"
        name="payment"
        checked={paymentMethod === "QRCODE"}
        onChange={() => setPaymentMethod("QRCODE")}
        className="mb-3"
      />

      {paymentMethod === "QRCODE" && orderId && (
        <div className="text-center mb-4">
          <p><strong>Quét mã QR để thanh toán</strong></p>

          <p className="text-info mt-3"> Nội dung chuyển khoản: <code>{orderId}</code></p>
        </div>
      )}

      <Button 
        className="mt-2" 
        style={{ backgroundColor: "#ff7f7f", border: "none" }} 
        onClick={handlePayment}
      >
        Thanh toán
      </Button>
    </Container>
  );
};

export default ConfirmOrderPage;
