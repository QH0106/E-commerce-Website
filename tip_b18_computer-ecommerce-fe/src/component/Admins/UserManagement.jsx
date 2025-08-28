import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router";
import axiosInstance from "../Author/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    roles: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    axiosInstance
      .get("/users/getAllUsers")
      .then((response) => setUsers(response.data.data || []))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleEdit = () => {
    axiosInstance
      .put(`/users/update/${currentUser.id}`, currentUser)
      .then(() => {
        alert("Cập nhật người dùng thành công");
        return axiosInstance.get("/users/getAllUsers");
      })
      .then((response) => {
        setUsers(response.data.data || []);
        setShow(false);
        setCurrentUser({
          id: "",
          fullName: "",
          email: "",
          phone: "",
          address: "",
          roles: "",
        });
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const handleShowModal = (user) => {
    setCurrentUser(user);
    setShow(true);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Link to="/Admin">
        <h2 style={{ paddingTop: "20px" }}>
          <FaArrowAltCircleLeft />
          Admin
        </h2>
      </Link>
      <h2>Quản lý Người dùng</h2>

      <Form className="mt-3 mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {currentUsers.map((user) => (
            <tr key={user.id} style={{ verticalAlign: "middle" }}>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.roles}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(user)}
                  className="me-2"
                  style={{ margin: "auto" }}
                >
                  <FaEdit /> Sửa
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
        {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(
          (number) => {
            const pageNumber = number + 1;
            if (Math.abs(currentPage - pageNumber) <= 2) {
              return (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              );
            }
            return null;
          }
        )}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage))
            )
          }
        />
        <Pagination.Last
          onClick={() =>
            setCurrentPage(Math.ceil(filteredUsers.length / usersPerPage))
          }
        />
      </Pagination>

      {/* Modal chỉnh sửa thông tin người dùng */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userfullname">
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.fullname || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, fullname: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="userEmail">
              <Form.Label>email</Form.Label>
              <Form.Control
                type="Email"
                value={currentUser.email || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="userPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="number"
                value={currentUser.phone || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="userAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.address || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, address: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
