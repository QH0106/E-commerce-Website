import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Author/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    fullname: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const qrRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.data.id;
    console.log(userId);

    if (!userId) return setLoading(false);

    axiosInstance
      .get(`/carts/getCartByUserId/${userId}`)
      .then((res) => {
        const cartDetails = res.data?.cartDetails || [];
        const formattedCart = cartDetails.map((item) => ({
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

  const handleRemoveItem = (cartItemId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (!confirmDelete) return;
    axiosInstance
      .delete(`/carts/items/${cartItemId}`)
      .then(() => {
        setCart(cart.filter((item) => item.cartItemId !== cartItemId));
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        toast.error("Xóa sản phẩm thất bại.");
      });
  };

  const handleSelectAll = (checked) => {
    setCart(cart.map((item) => ({ ...item, selected: checked })));
  };

  const total = cart
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleBuy = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.data.id;

    if (!currentUser?.data.id) {
      toast.warning("Bạn cần đăng nhập để thanh toán.");
      return;
    }

    const selectedItems = cart.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      toast.info("Vui lòng chọn ít nhất 1 sản phẩm.");
      return;
    }

    if (!customer.phone || !customer.address) {
      alert(
        "Vui lòng nhập đầy đủ thông tin khách hàng (Số điện thoại, Địa chỉ)."
      );
      return;
    }

    const orderData = {
      cartItemIds: selectedItems.map((item) => item.cartItemId),
      shippingAddress: customer.address,
      note: customer.address || "",
    };

    axiosInstance
      .post("/orders/create", orderData)
      .then((response) => {
        const createdOrderId = response.data.orderId;
        setOrderId(createdOrderId);

        if (paymentMethod === "COD") {
          alert("Đặt hàng thành công!");
          setTimeout(() => {
            axiosInstance
              .get(`/carts/getCartByUserId/${userId}`)
              .then((res) => {
                const updatedCart = res.data?.cartDetails || [];
                const formattedCart = updatedCart.map((item) => ({
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
              })
              .catch((err) => {
                console.error("Lỗi khi cập nhật giỏ hàng:", err);
              });

            navigate("/ConfirmOrderPage", { state: { customer, total } });
          }, 1000);
        } else {
          setTimeout(() => {
            setShowQR(true);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API tạo đơn hàng:", error);
        toast.error("Đặt hàng thất bại.");
      });
  };

  const handlePayment = () => {
    if (!orderId) return;

    axiosInstance
      .get("/orders/user")
      .then((res) => {
        const orders = res.data?.data?.content || [];
        const matchedOrder = orders.find((o) => o.orderId === orderId);

        if (matchedOrder?.paymentStatus === "PAID") {
          setPaymentStatus("PAID");
          toast.success("Thanh toán thành công!");
          navigate("/ConfirmOrderPage", { state: { customer, total } });
        } else {
          toast.warning("Chưa nhận được thanh toán, vui lòng thử lại sau.");
        }
      })
      .catch((err) => {
        console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
      });
  };

  const handleAction = () => {
    if (!orderId) {
      handleBuy();
    } else if (paymentMethod === "QRCODE") {
      handlePayment();
    }
  };

  useEffect(() => {
    if (paymentMethod === "QRCODE" && paymentStatus === "UNPAID" && orderId) {
      const interval = setInterval(() => {
        axiosInstance
          .get("/orders/user")
          .then((res) => {
            const orders = res.data?.data?.content || [];
            const matchedOrder = orders.find((o) => o.orderId === orderId);
            if (matchedOrder?.paymentStatus === "PAID") {
              setPaymentStatus("PAID");
              clearInterval(interval);
            }
          })
          .catch((err) => {
            console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
          });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [orderId, paymentMethod, paymentStatus]);

  useEffect(() => {
    if (showQR && qrRef.current) {
      qrRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showQR]);

  const qrImageUrl = `https://qr.sepay.vn/img?acc=38329112004&bank=TPB&amount=${total}&des=${orderId}`;

  if (loading) {
    return (
      <div
        style={{ height: "100vh", backgroundColor: "gray" }}
        className="d-flex justify-content-center align-items-center"
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <a
            href="/ProDuct"
            style={{ textDecoration: "none", fontSize: "16px" }}
          >
            Xem thêm sản phẩm khác
          </a>

          <Form.Check
            style={{ fontSize: "16px" }}
            type="checkbox"
            label="Chọn tất cả"
            className="my-3"
            checked={cart.every((item) => item.selected)}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />

          {cart.length === 0 && (
            <p style={{ fontSize: "18px" }}>
              Không có sản phẩm trong giỏ hàng.
            </p>
          )}

          {cart.map((item) => (
            <Row
              key={item.id}
              className="align-items-center border-top py-3"
              style={{ fontSize: "18px" }}
            >
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
              <Col xs={4}>{item.name}</Col>
              <Col xs={2}>
                <div className="text-danger fw-bold">
                  {item.price.toLocaleString()}₫
                </div>
              </Col>
              <Col xs="auto">
                <div className="d-flex align-items-center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 1}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "1rem 0 0 1rem",
                      margin: "auto",
                    }}
                  >
                    <i className="fas fa-minus" />
                  </Button>

                  <div
                    style={{
                      width: "40px",
                      height: "30px",
                      textAlign: "center",
                      borderTop: "1px solid #ced4da",
                      borderBottom: "1px solid #ced4da",
                    }}
                  >
                    {item.quantity}
                  </div>

                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, 1)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "0 1rem 1rem 0",
                      margin: "auto",
                    }}
                  >
                    <i className="fas fa-plus" />
                  </Button>
                </div>
              </Col>
              <Col xs={1}>
                <Button
                  variant="link"
                  className="text-danger"
                  style={{ margin: "auto" }}
                  onClick={() => handleRemoveItem(item.cartItemId)}
                >
                  <i className="fa-solid fa-trash"></i>
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
            onChange={(e) =>
              setCustomer({ ...customer, fullname: e.target.value })
            }
          />
          <Form.Control
            type="number"
            placeholder="Số Điện Thoại"
            className="mb-2"
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />

          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Địa Chỉ Nhận Hàng"
            className="mb-3"
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />

          <h6>Chọn hình thức thanh toán</h6>
          <Form.Check
            style={{ fontSize: "16px" }}
            type="radio"
            label="Thanh toán khi giao hàng (COD)"
            name="payment"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          <Form.Check
            style={{ fontSize: "16px" }}
            type="radio"
            label="Thanh toán qua thẻ ngân hàng (QR Code)"
            name="payment"
            checked={paymentMethod === "QRCODE"}
            onChange={() => setPaymentMethod("QRCODE")}
            className="mb-3"
          />

          <p style={{ fontSize: "16px" }}>
            Phí vận chuyển: <strong>Miễn phí</strong>
          </p>
          <p style={{ fontSize: "16px" }}>
            Tổng tiền: <strong>{total.toLocaleString()}₫</strong>
          </p>

          {paymentMethod === "QRCODE" && orderId && (
            <div className="text-center mb-3" ref={qrRef}>
              <p style={{ fontSize: "16px" }}>
                <strong>Quét mã QR để thanh toán</strong>
              </p>
              <Image
                src={qrImageUrl}
                alt="QR Code"
                fluid
                style={{ maxWidth: "200px" }}
              />
              <p className="text-info mt-2" style={{ fontSize: "16px" }}>
                Nội dung chuyển khoản: <code>{orderId}</code>
              </p>
              {paymentStatus === "UNPAID" && (
                <p className="text-warning" style={{ fontSize: "16px" }}>
                  Đang chờ xác nhận thanh toán...
                </p>
              )}
              {paymentStatus === "PAID" && (
                <p
                  className="text-success fw-bold"
                  style={{ fontSize: "16px" }}
                >
                  Thanh toán đã hoàn tất!
                </p>
              )}
            </div>
          )}

          <Button
            style={{ fontSize: "16px", margin: "auto" }}
            variant={paymentMethod === "COD" ? "danger" : "success"}
            className="w-100"
            onClick={handleAction}
          >
            {!orderId
              ? "Xác nhận đặt hàng"
              : paymentMethod === "COD"
              ? "Đặt hàng (COD)"
              : "Tôi đã chuyển khoản"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
