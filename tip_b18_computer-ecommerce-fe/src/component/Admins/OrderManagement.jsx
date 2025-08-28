import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import axiosInstance from "../Author/axiosInstance";
import { FaEdit, FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "CANCELLED",
  "DELIVERED",
  "COMPLETED",
];
const paymentStatuses = ["UNPAID", "PAID"];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderInfo, setOrderInfo] = useState(null);
  const ordersPerPage = 10;

  const fetchOrders = (orderStatus = "", paymentStatus = "") => {
    let url = `/orders/getAllOrders?page=1&size=100`;
    if (orderStatus) url += `&orderStatus=${orderStatus}`;
    if (paymentStatus) url += `&paymentStatus=${paymentStatus}`;

    axiosInstance
      .get(url)
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err));
  };

  useEffect(() => {
    fetchOrders(filterStatus, filterPaymentStatus);
  }, [filterStatus, filterPaymentStatus]);

  const handleOpenModal = (order) => {
    setSelectedOrder({ ...order });
    setShow(true);
  };

  const handleStatusUpdate = () => {
    axiosInstance
      .put(`/orders/${selectedOrder.orderId}/status`, {
        orderStatus: selectedOrder.orderStatus,
        paymentStatus: selectedOrder.paymentStatus,
      })
      .then(() => {
        alert("Cập nhật trạng thái thành công!");
        setShow(false);
        fetchOrders(filterStatus);
        setFilterPaymentStatus("");
        fetchOrders();
      })
      .catch(() => alert("Lỗi cập nhật trạng thái."));
  };

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus);
    setCurrentPage(1);
    fetchOrders(selectedStatus);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const currentOrders = orders.slice(
    indexOfLastOrder - ordersPerPage,
    indexOfLastOrder
  );

  const handleDetail = async (orderId) => {
    try {
      const res = await axiosInstance.get(`/orders/admin/${orderId}`);
      const data = res.data.data;

      // Lưu toàn bộ thông tin order
      setOrderInfo({
        orderId: data.orderId,
        userEmail: data.userEmail,
        createdAt: data.createdAt,
        orderStatus: data.orderStatus,
        paymentStatus: data.paymentStatus,
        shippingAddress: data.shippingAddress,
        note: data.note,
        totalAmount: data.totalAmount,
      });

      // Lưu chi tiết sản phẩm
      const mapItems = (data.items ?? []).map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.unitPrice,
        thumbnail: item.thumbnail,
      }));
      setOrderDetails(mapItems);

      setShowDetail(true);
    } catch (err) {
      console.error("lỗi lấy chi tiết đơn hàng", err);
      alert("lỗi lấy chi tiết đơn hàng");
    }
  };

  return (
    <Container>
      <Link to="/Admin">
        <h2 style={{ paddingTop: "20px" }}>
          <FaArrowAltCircleLeft /> Admin
        </h2>
      </Link>
      <h2>Quản lý đơn hàng</h2>

      <div className="d-flex col-5">
        <Form.Select
          className="mb-3"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="">-- Chọn trạng thái đơn hàng --</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className="mb-3"
          style={{ marginLeft: "10px" }}
          value={filterPaymentStatus}
          onChange={(e) => {
            const status = e.target.value;
            setFilterPaymentStatus(status);
            setCurrentPage(1);
            fetchOrders(filterStatus, status);
          }}
        >
          <option value="">-- Chọn trạng thái thanh toán --</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>
      </div>

      <Table striped bordered hover>
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>Người đặt</th>
            <th>Thông tin</th>
            <th>Mã Order</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {currentOrders.map((order) => (
            <tr key={order.orderId} style={{ verticalAlign: "middle" }}>
              <td>{order.userEmail}</td>
              <td>{order.shippingAddress}</td>
              <td>{order.orderId}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.orderStatus}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.totalAmount.toLocaleString()} đ</td>
              <td>
                <Button
                  variant="warning"
                  style={{ margin: "auto", marginBottom: "5px" }}
                  onClick={() => handleOpenModal(order)}
                >
                  Cập nhật
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleDetail(order.orderId)}
                  style={{ margin: "auto" }}
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} />
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
        {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map(
          (i) => {
            const number = i + 1;
            if (Math.abs(currentPage - number) <= 2) {
              return (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </Pagination.Item>
              );
            }
            return null;
          }
        )}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(orders.length / ordersPerPage))
            )
          }
        />
        <Pagination.Last
          onClick={() =>
            setCurrentPage(Math.ceil(orders.length / ordersPerPage))
          }
        />
      </Pagination>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>Email: {selectedOrder.userEmail}</p>
              <p>Đơn hàng: {selectedOrder.orderId}</p>
              <Form.Select
                value={selectedOrder.orderStatus}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    orderStatus: e.target.value,
                  })
                }
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                value={selectedOrder.paymentStatus}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    paymentStatus: e.target.value,
                  })
                }
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderInfo && (
            <div className="mb-3">
              <p>
                <strong>Thông tin người đặt:</strong> {orderInfo.note},{" "}
                {orderInfo.shippingAddress}
              </p>
            </div>
          )}

          {orderDetails === null ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : orderDetails.length > 0 ? (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td className="text-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span className="text-muted">Không có ảnh</span>
                        )}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">
                        {Number(item.price).toLocaleString()} đ
                      </td>
                      <td className="text-end">
                        {(Number(item.price) * item.quantity).toLocaleString()}{" "}
                        đ
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">
                      Tổng cộng:
                    </td>
                    <td className="text-end fw-bold">
                      {orderInfo.totalAmount.toLocaleString()} đ
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          ) : (
            <div className="text-center py-3">
              <p>Không có dữ liệu chi tiết đơn hàng</p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
