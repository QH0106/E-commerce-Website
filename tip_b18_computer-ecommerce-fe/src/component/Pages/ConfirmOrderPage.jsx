import React from "react";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, total } = location.state || {};

  return (
    <Container className="py-5">
      <a href="/Cart" onClick={() => navigate(-1)} style={{ textDecoration: "underline" }}>
        &larr; Quay lại
      </a>

      <h5 className="mt-3">Thông tin đặt hàng</h5>
      <ul>
        <li><strong>Khách hàng:</strong> {customer?.fullname}</li>
        <li><strong>Số điện thoại:</strong> {customer?.phone}</li>
        <li><strong>Địa chỉ nhận hàng:</strong> {customer?.address}</li>
        <li><strong>Phí vận chuyển:</strong> Miễn Phí</li>
        <li><strong>Tổng tiền:</strong> {total?.toLocaleString()}₫</li>
      </ul>


    </Container>
  );
};

export default ConfirmOrderPage;
