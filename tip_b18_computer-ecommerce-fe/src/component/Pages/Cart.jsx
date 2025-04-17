import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";
import axiosInstance from "../Author/axiosInstance";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const qrRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.id;
    if (!userId) return setLoading(false);

    axiosInstance
      .get(`http://192.168.199.43:8080/api/carts/getCartByUserId/${userId}`)
      .then((res) => {
        const cartData = res.data?.cartDetails || [];
        const formattedCart = cartData.map((item) => ({
          id: item.productId,
          cartItemId: item.id,
          name: item.nameProduct,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          price: item.unitPrice,
          totalPrice: item.totalPrice,
          selected: true,
        }));
        setCart(formattedCart);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy giỏ hàng:", err);
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
    if (!currentUser?.email) return alert("Bạn cần đăng nhập để thanh toán.");

    const selectedItems = cart.filter((item) => item.selected);
    if (selectedItems.length === 0) return alert("Vui lòng chọn ít nhất 1 sản phẩm.");

    if (!customer.name || !customer.phone || !customer.address) {
      return alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
    }

    const orderData = {
      cartItemIds: selectedItems.map((item) => item.cartItemId),
      shippingAddress: customer.address,
      note: customer.note || "",
      paymentMethod: paymentMethod,
    };

    axiosInstance
      .post("http://192.168.199.43:8080/api/orders/create", orderData)
      .then((response) => {
        const { orderId, paymentStatus } = response.data?.data || {};
        setOrderId(orderId);
        setPaymentStatus(paymentStatus);
        alert("Đặt hàng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi thanh toán:", error);
        alert("Đặt hàng thất bại.");
      });
  };

  const handlePaymentConfirmation = () => {
    if (paymentStatus === "PAID") {
      alert("Đơn hàng đã được thanh toán thành công!");
    } else {
      alert("Vui lòng quét mã QR và chờ xác nhận thanh toán.");
    }
  };

  // Kiểm tra trạng thái thanh toán real-time
  useEffect(() => {
    let interval;
    if (paymentMethod === "QRCODE" && orderId && paymentStatus === "UNPAID") {
      interval = setInterval(() => {
        axiosInstance
          .get(`http://192.168.199.43:8080/api/orders/status/${orderId}`)
          .then((res) => {
            const newStatus = res.data?.data?.paymentStatus;
            if (newStatus === "PAID") {
              setPaymentStatus("PAID");
              alert("Thanh toán thành công!");
              clearInterval(interval);
            }
          })
          .catch((err) => {
            console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
          });
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [orderId, paymentMethod, paymentStatus]);

  // Tự động scroll đến QR khi chọn phương thức
  useEffect(() => {
    if (paymentMethod === "QRCODE" && qrRef.current) {
      qrRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [paymentMethod]);

  const qrImageUrl = `https://qr.sepay.vn/img?acc=38329112004&bank=TPB&amount=${total}&des=${orderId}`;
  console.log('ddaay la',qrImageUrl);
  

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <a href="/ProDuct" style={{ textDecoration: "none", fontSize:"16px" }}>Xem thêm sản phẩm khác</a>

          <Form.Check
            style={{fontSize:"16px"}}
            type="checkbox"
            label="Chọn tất cả"
            className="my-3"
            checked={cart.every((item) => item.selected)}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />

          {cart.length === 0 && <p style={{fontSize:"18px"}}>Không có sản phẩm trong giỏ hàng.</p>}

          {cart.map((item) => (
            <Row key={item.id} className="align-items-center border-top py-3" style={{fontSize:"18PX"}}>
              <Col xs={1} >
                <Form.Check
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleSelectItem(item.id)}
                />
              </Col>
              <Col xs={2}><Image src={item.thumbnail} thumbnail /></Col>
              <Col xs={5}>{item.name}</Col>
              <Col xs={2}>
                <div className="text-danger fw-bold">{item.price.toLocaleString()}₫</div>
              </Col>
              <Col xs={1}>
                <InputGroup size="sm">
                  <Button variant="outline-secondary" onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                  <Form.Control value={item.quantity} readOnly style={{ width: "40px", textAlign: "center" }} />
                  <Button variant="outline-secondary" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                </InputGroup>
              </Col>
              <Col xs={1}>
                <Button variant="link" className="text-danger" onClick={() => handleRemoveItem(item.id)}>
                  <i className="fa-solid fa-trash"></i>
                </Button>
              </Col>
            </Row>
          ))}
        </Col>

        <Col md={4} className="border p-3">
          <h6>Thông tin khách hàng</h6>
          <Form.Control placeholder="Tên Khách Hàng" className="mb-2" disabled={!!orderId} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <Form.Control placeholder="Số Điện Thoại" className="mb-2" disabled={!!orderId} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <Form.Control as="textarea" rows={2} placeholder="Địa Chỉ Nhận Hàng" className="mb-3" disabled={!!orderId} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />

          <h6>Chọn hình thức thanh toán</h6>
          <Form.Check 
            style={{fontSize:"16px"}}
            type="radio"
            label="Thanh toán khi giao hàng (COD)"
            name="payment"
            checked={paymentMethod === "COD"}
            disabled={!!orderId}
            onChange={() => setPaymentMethod("COD")}
          />
          <Form.Check 
            style={{fontSize:"16px"}}
            type="radio"
            label="Thanh toán qua thẻ ngân hàng (QR Code)"
            name="payment"
            checked={paymentMethod === "QRCODE"}
            disabled={!!orderId}
            onChange={() => setPaymentMethod("QRCODE")}
            className="mb-3"
          />

          <p style={{fontSize:"16px"}}>Phí vận chuyển: <strong>Miễn phí</strong></p>
          <p style={{fontSize:"16px"}}>Tổng tiền: <strong>{total.toLocaleString()}₫</strong></p>

          {paymentMethod === "QRCODE" && orderId && (
            <div className="text-center mb-3" ref={qrRef}>
              <p style={{fontSize:"16px"}}><strong>Quét mã QR để thanh toán</strong></p>
              <Image src={qrImageUrl} alt="QR Code" fluid style={{ maxWidth: "200px" }} />
              <p className="text-info mt-2" style={{fontSize:"16px"}}>Nội dung chuyển khoản: <code>{orderId}</code></p>
              {paymentStatus === "UNPAID" && <p className="text-warning" style={{fontSize:"16px"}}>Đang chờ xác nhận thanh toán...</p>}
              {paymentStatus === "PAID" && <p className="text-success fw-bold" style={{fontSize:"16px"}}>Thanh toán đã hoàn tất!</p>}
            </div>
          )}

          {!orderId ? (
            <Button variant="danger" className="w-100" style={{margin:"auto", fontSize:"16px"}} onClick={handleBuy}>
              Xác nhận đặt hàng
            </Button>
          ) : (
            <Button variant="success" className="w-100" onClick={handlePaymentConfirmation}>
              {paymentMethod === "COD" ? "Đã đặt hàng (COD)" : "Tôi đã chuyển khoản"}
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
