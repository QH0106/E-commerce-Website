import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
import { Container, Row, Col, Form, Button, Tab, Tabs } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";


const UserProfilePage = () => {
  const [key, setKey] = useState("info");
  const [user, setUser] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    birthdate: "",
  });

  const handleSave = () => {
    toast.success("Thông tin đã được lưu!");
  };

// const handleSave = async () => {
//   try {
//     await axios.put("/user/update", user);
//     toast.success(" Thông tin đã được lưu!");
//   } catch (error) {
//     toast.error(" Có lỗi xảy ra khi lưu!");
//   }
// };

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("currentUser");
    toast.info("Đã đăng xuất!");
  };

  // const handleLogout = async () => {
  //   try {
  //     await axios.post("/api/logout"); 
  //     localStorage.removeItem("currentUser");
  //     localStorage.removeItem("token");
  //     toast.info(" Đã đăng xuất!");
  //   } catch (error) {
  //     toast.error(" Đăng xuất thất bại!");
  //   }
  // };

  return (
    <Container className="py-5">
      <Row>
        <Col md={3} className="border-end">
          <h5 className="fw-bold mb-4">👤 Nguyễn Văn A</h5>
          <div
            className={`mb-3 ${key === "info" ? "text-danger" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setKey("info")}
          >
            Thông tin tài Khoản
          </div>
          <div
            className={`mb-3 ${key === "address" ? "text-danger" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setKey("address")}
          >
            Địa Chỉ
          </div>
          <div
            className={`mb-3 ${key === "orders" ? "text-danger" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setKey("orders")}
          >
            Theo dõi đơn hàng
          </div>
          <div className="text-black" style={{ cursor: "pointer" }} onClick={handleLogout}>
            Đăng xuất
          </div>
        </Col>

        <Col md={9}>
          <Tabs id="product-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            <Tab eventKey="info" title="Thông tin tài khoản">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Họ Tên</Form.Label>
                  <Form.Control
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Nam"
                      name="gender"
                      type="radio"
                      checked={user.gender === "male"}
                      onChange={() => setUser({ ...user, gender: "male" })}
                    />
                    <Form.Check
                      inline
                      label="Nữ"
                      name="gender"
                      type="radio"
                      checked={user.gender === "female"}
                      onChange={() => setUser({ ...user, gender: "female" })}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={user.birthdate}
                    onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                  />
                </Form.Group>

                <Button variant="danger" onClick={handleSave}>
                  Lưu
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="address" title="Địa Chỉ">
              <p>Hiển thị hoặc chỉnh sửa địa chỉ giao hàng tại đây.</p>
            </Tab>

            <Tab eventKey="orders" title="Quản lý đơn hàng">
              <p>Xem lịch sử hoặc trạng thái đơn hàng.</p>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ToastContainer position="top-center" autoClose={2000} />
    </Container>
  );
};

export default UserProfilePage;
