import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";
import axios from "axios"; // Thêm axios vào

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true); // Thêm loading để quản lý trạng thái tải
  const navigate = useNavigate();

  // Gọi API để lấy giỏ hàng khi component được mount
  useEffect(() => {
    // Thực hiện gọi API để lấy giỏ hàng
    axios
      .get("http://192.168.199.43:8080/api/carts/getCartByUserId/{userId}")
      .then((response) => {
        setCart(response.data); // Cập nhật giỏ hàng từ API
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy giỏ hàng", error);
        setLoading(false); 
      });
  }, []);

  // Hàm xử lý thay đổi số lượng sản phẩm trong giỏ
  const handleQuantityChange = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Đảm bảo số lượng không nhỏ hơn 1
          : item
      )
    );
  };

  // Hàm xử lý việc chọn hoặc bỏ chọn sản phẩm
  const handleSelectItem = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Hàm chọn hoặc bỏ chọn tất cả sản phẩm trong giỏ
  const handleSelectAll = (checked) => {
    setCart(cart.map((item) => ({ ...item, selected: checked })));
  };

  // Tính tổng tiền của giỏ hàng (chỉ tính các sản phẩm đã chọn)
  const total = cart
    .filter((item) => item.selected) // lọc sp được chọn
    .reduce((sum, item) => sum + item.price * item.quantity, 0); // tổng tiền

  // Hàm xử lý thanh toán (gọi API bằng axios)
  const handleBuy = () => {
    const orderData = {
      id: "unique-order-id",  // ID đơn hàng (có thể tự tạo hoặc lấy từ auth)
      cart: cart
        .filter(item => item.selected)  // Lọc các sản phẩm đã chọn
        .map(item => ({
          productId: item.id,
          nameProduct: item.name,
          thumbnail: item.image,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      totalPrice: total,  // Tổng tiền giỏ hàng
    };

    const apiUrl = "/"; // URL API thanh toán

    // Gọi API với axios
    axios
      .post(apiUrl, orderData) // Gọi API thanh toán
      .then((response) => {
        console.log("Thanh toán thành công", response.data);
        navigate('/HomePage'); // Điều hướng sau khi thanh toán thành công
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi thanh toán", error);
      });
  };

  // Nếu đang tải dữ liệu thì hiển thị thông báo loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <h5> Xem thêm sản phẩm khác</h5>
          {/* Checkbox chọn tất cả */}
          <Form.Check
            type="checkbox"
            label="Chọn tất cả"
            className="my-3"
            onChange={(e) => handleSelectAll(e.target.checked)} // Gọi hàm chọn tất cả khi checkbox thay đổi
          />
          {/* Duyệt qua tất cả sản phẩm trong giỏ */}
          {cart.map((item) => (
            <Row key={item.id} className="align-items-center border-top py-3">
              <Col xs={1}>
                {/* Checkbox chọn sản phẩm */}
                <Form.Check
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleSelectItem(item.id)} // Xử lý khi checkbox thay đổi
                />
              </Col>
              <Col xs={2}>
                {/* Hình ảnh sản phẩm */}
                <Image src={item.image} thumbnail />
              </Col>
              <Col xs={5}>{item.name}</Col>
              <Col xs={2}>
                {/* Giá sản phẩm và giá cũ */}
                <div className="text-danger fw-bold">{item.price.toLocaleString()}₫</div>
                <div>
                  <del>{item.oldPrice.toLocaleString()}₫</del> -7%
                </div>
              </Col>
              <Col xs={1}>
                {/* Điều chỉnh số lượng sản phẩm */}
                <InputGroup size="sm">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(item.id, -1)} // Giảm số lượng
                  >
                    -
                  </Button>
                  <Form.Control
                    value={item.quantity}
                    readOnly
                    style={{ width: "40px", textAlign: "center" }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(item.id, 1)} // Tăng số lượng
                  >
                    +
                  </Button>
                </InputGroup>
              </Col>
              <Col xs={1}>
                {/* Nút xóa sản phẩm */}
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => handleRemoveItem(item.id)} // Xử lý khi xóa sản phẩm
                >
                  🗑
                </Button>
              </Col>
            </Row>
          ))}
        </Col>

        <Col md={4} className="border p-3">
          <h6>Thông tin khách hàng</h6>
          {/* Các trường nhập liệu thông tin khách hàng */}
          <Form.Control
            placeholder="Tên Khách Hàng"
            className="mb-2"
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })} // Cập nhật tên khách hàng
          />
          <Form.Control
            placeholder="Số Điện Thoại"
            className="mb-2"
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} // Cập nhật số điện thoại
          />
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Địa Chỉ Nhận Hàng"
            className="mb-3"
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })} // Cập nhật địa chỉ
          />

          <h6>Thông Tin Đơn Hàng</h6>
          <p>Phí Vận Chuyển: Miễn Phí</p>
          <p>Tổng Tiền: {total.toLocaleString()}₫</p> {/* Hiển thị tổng tiền */}
          <Button variant="danger" className="w-100" onClick={handleBuy}>
            Thanh Toán
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
