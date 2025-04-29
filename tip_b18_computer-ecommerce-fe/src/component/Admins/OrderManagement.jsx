import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axiosInstance from '../Author/axiosInstance';
import { FaEdit, FaArrowAltCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const orderStatuses = ["PENDING", "CONFIRMED", "SHIPPING", "CANCELLED", "DELIVERED", "COMPLETED"];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = (status = '') => {
    let url = `/orders/getAllOrders?page=1&size=100`;
    if (status) {
      url += `&orderStatus=${status}`;
    }
    axiosInstance.get(url)
      .then(res => setOrders(res.data.data || []))
      .catch(err => console.error("Lỗi lấy đơn hàng:", err));
  };
  

  useEffect(() => {
    fetchOrders()
  }, []);
  

  const handleOpenModal = (order) => {
    setSelectedOrder({ ...order });
    setShow(true);
  };

  const handleStatusUpdate = () => {
    axiosInstance.put(`/orders/${selectedOrder.orderId}/status`, {
      orderStatus: selectedOrder.orderStatus
    })
      .then(() => {
        alert("Cập nhật trạng thái thành công!");
        setShow(false);
        fetchOrders(filterStatus);
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
  const currentOrders = orders.slice(indexOfLastOrder - ordersPerPage, indexOfLastOrder);

  return (
    <Container>
      <Link to="/Admin"><h2 style={{paddingTop:"20px"}}><FaArrowAltCircleLeft /> Admin</h2></Link>
      <h2>Quản lý đơn hàng</h2>

      <Form.Select
        className="mb-3 mt-3"
        value={filterStatus}
        onChange={handleFilterChange}
      >
        <option value="">-- Chọn trạng thái đơn hàng --</option>
        {orderStatuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </Form.Select>

      <Table striped bordered hover>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <th>Người đặt</th>
            <th>Mã Order</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: 'center' }}>
          {currentOrders.map(order => (
            <tr key={order.orderId}>
              <td>{order.userEmail}</td>
              <td>{order.orderId}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.orderStatus}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.totalAmount.toLocaleString()} đ</td>
              <td>
                <Button variant="warning" onClick={() => handleOpenModal(order)}>
                  <FaEdit /> Cập nhật
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
        {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()]
          .map(i => {
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
          })}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(orders.length / ordersPerPage)))} />
        <Pagination.Last onClick={() => setCurrentPage(Math.ceil(orders.length / ordersPerPage))} />
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
                onChange={(e) => setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value })}
              >
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleStatusUpdate}>Cập nhật</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
