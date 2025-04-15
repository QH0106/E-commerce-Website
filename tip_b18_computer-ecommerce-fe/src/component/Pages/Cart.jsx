import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Container,Row,Col,Form,Button,Image,InputGroup,} from "react-bootstrap";
import axiosInstance from "../Author/axiosInstance";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.id;

    if (!userId) {
      console.error("Chưa đăng nhập hoặc thiếu userId.");
      setLoading(false);
      return;
    }

    axiosInstance
      .get(`http://192.168.199.43:8080/api/carts/getCartByUserId/${userId}`)
      .then((response) => {
        const cartData = response.data?.cartDetails || [];
        const formattedCart = cartData.map((item) => ({
          id: item.productId,
          name: item.nameProduct,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          price: item.unitPrice,
          oldPrice: item.unitPrice * 1.1,
          selected: true, // mặc định chọn sản phẩm
        }));
        setCart(formattedCart);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setLoading(false);
      });
  }, []);

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
    .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleBuy = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser?.id) return alert("Bạn cần đăng nhập để thanh toán.");

    const orderData = {
      userId: currentUser.id,
      cartDetails: cart
        .filter((item) => item.selected)
        .map((item) => ({
          productId: item.id,
          nameProduct: item.name,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      totalPrice: total,
    };

    axiosInstance
      .post("http://192.168.199.43:8080/api/orders/create", orderData)
      .then((response) => {
        console.log("Thanh toán thành công", response.data);
        alert("Đặt hàng thành công!");
        navigate("/HomePage");
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi thanh toán", error);
        alert("Đặt hàng thất bại. Vui lòng thử lại.");
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <a href="/ProDuct">⬅ Xem thêm sản phẩm khác</a>

          <Form.Check
            type="checkbox"
            label="Chọn tất cả"
            className="my-3"
            checked={cart.every((item) => item.selected)}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />

          {cart.length === 0 && <p>Không có sản phẩm trong giỏ hàng.</p>}

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
                <Image src={item.thumbnail} thumbnail />
              </Col>
              <Col xs={5}>{item.name}</Col>
              <Col xs={2}>
                <div className="text-danger fw-bold">
                  {(item.price || 0).toLocaleString()}₫
                </div>
                <div>
                  <del>{(item.oldPrice || 0).toLocaleString()}₫</del>
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

          <h6>Thông tin đơn hàng</h6>
          <p>Phí vận chuyển: <strong>Miễn phí</strong></p>
          <p>Tổng tiền: <strong>{total.toLocaleString()}₫</strong></p>
          <Button variant="danger" className="w-100" onClick={handleBuy}>
            Thanh Toán
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
