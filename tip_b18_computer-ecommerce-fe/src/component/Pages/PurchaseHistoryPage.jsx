import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Card, Button, Modal, Table, Badge, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../Author/axiosInstance';

const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    axiosInstance.get('orders/user')
      .then(res => {
        setOrders(res.data.data.content || []);
      })
      .catch(err => console.error(err));
  }, []);

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.orderStatus.toLowerCase() === status);
  };

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const statusVariant = {
    pending: 'warning',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Lịch sử mua hàng</h2>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="all" title="Tất cả" />
        <Tab eventKey="pending" title="Chờ xác nhận" />
        <Tab eventKey="shipped" title="Đang giao" />
        <Tab eventKey="delivered" title="Đã giao" />
        <Tab eventKey="cancelled" title="Đã huỷ" />
      </Tabs>

      {filterOrders(activeTab).map((order, idx) => (
        <Card key={idx} className="mb-3 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex">
              {order.items.length > 0 && (
                <img
                  src={order.items[0].thumbnail}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px', borderRadius: '8px' }}
                />
              )}

              <div>
                {/* <Card.Title>{order.items[0].productName}</Card.Title> */}
                <Card.Text>Đơn hàng #{order.orderId}</Card.Text>
                <Card.Text>Ngày đặt: {new Date(order.createdAt).toLocaleString()}</Card.Text>
                <Badge bg={statusVariant[order.orderStatus.toLowerCase()] || "secondary"}>
                  {order.orderStatus}
                </Badge>{' '}
                <Badge bg={order.paymentStatus === "PAID" ? "success" : "warning"}>
                  {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                </Badge>
              </div>
            </div>

              <div className="text-end">
                <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()}₫</p>
                <Button variant="primary" onClick={() => handleShowDetail(order)}>Xem chi tiết</Button>{' '}
                <Button variant="outline-success">Mua lại</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Pagination (giả định) */}
      <Pagination>
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Next />
      </Pagination>

      {/* Modal Chi tiết đơn hàng */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.orderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress || "Chưa cung cấp"}</p>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice.toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p><strong>Tổng cộng:</strong> {selectedOrder.totalAmount.toLocaleString()}₫</p>
              <hr />
              {/* <Button variant="success">Đánh giá sản phẩm</Button>{' '} */}
              {/* <Button variant="outline-secondary">Tải hoá đơn</Button> */}
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PurchaseHistoryPage;
