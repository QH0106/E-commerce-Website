import React, { useState } from "react";
import {Container,Row,Col,Form,Button,Image,InputGroup,} from "react-bootstrap";

const initialCart = [
  {
    id: 1,
    name: "PC GVN AMD R5-8400F/ VGA RX 7600 (Powered by ASUS)",
    price: 23390000,
    oldPrice: 25210000,
    image: "/public/image-2.png",
    quantity: 1,
    selected: false,
  },
  {
    id: 2,
    name: "PC GVN Intel i3-12100F/ VGA RX 6500XT (Powered by ASUS)",
    price: 23390000,
    oldPrice: 25210000,
    image: "/public/image-1.png",
    quantity: 1,
    selected: true,
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  const handleQuantityChange = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleSelectItem = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleSelectAll = (checked) => {
    setCart(cart.map((item) => ({ ...item, selected: checked })));
  };

  const total = cart
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <h5> Xem thêm sản phẩm khác</h5>
          <Form.Check
            type="checkbox"
            label="Chọn tất cả"
            className="my-3"
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          {cart.map((item) => (
            <Row key={item.id} className="align-items-center border-top py-3">
              <Col xs={1}>
                <Form.Check
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleSelectItem(item.id)}
                />
              </Col>
              <Col xs={2}>
                <Image src={item.image} thumbnail />
              </Col>
              <Col xs={5}>{item.name}</Col>
              <Col xs={2}>
                <div className="text-danger fw-bold">{item.price.toLocaleString()}₫</div>
                <div>
                  <del>{item.oldPrice.toLocaleString()}₫</del> -7%
                </div>
              </Col>
              <Col xs={1}>
                <InputGroup size="sm">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(item.id, -1)}
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
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </Button>
                </InputGroup>
              </Col>
              <Col xs={1}>
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  🗑
                </Button>
              </Col>
            </Row>
          ))}
        </Col>

        <Col md={4} className="border p-3">
          <h6>Thông tin khách hàng</h6>
          <Form.Control
            placeholder="Tên Khách Hàng"
            className="mb-2"
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <Form.Control
            placeholder="Số Điện Thoại"
            className="mb-2"
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Địa Chỉ Nhận Hàng"
            className="mb-3"
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
          />

          <h6>Thông Tin Đơn Hàng</h6>
          <p>Phí Vận Chuyển: Miễn Phí</p>
          <p>Tổng Tiền: {total.toLocaleString()}₫</p>
          <Button variant="danger" className="w-100">
            Mua
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
