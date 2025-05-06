import React, { useEffect, useState } from "react";
import axiosInstance from "../Author/axiosInstance";
import { Container, Row, Col, Form, Button, Tab, Tabs } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [key, setKey] = useState("info");
  const [userData, setUserData] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [passwordData, setPasswordData] = useState({
    username:"",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    axiosInstance.get("/users/me")
      .then((res) => {
        const user = res.data.data;
        if (user.role === "ADMIN") {
          axiosInstance.get(`/users/getById/${user.id}`)
            .then((res2) => {
              setUserData(res2.data.data);
              setUpdateData(res2.data.data);
            })
            .catch((err) => {
              console.error(err);
              toast.error("Không lấy được thông tin ADMIN");
            });
        } else {
          setUserData(user);
          setUpdateData(user);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Không lấy được thông tin người dùng");
      });
  }, []);
  

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/users/update/${userData.id}`, updateData);
      toast.success("Thông tin đã được lưu!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi lưu thông tin!");
    }
  };

  const handleChangePassword = async () => {
    try {
      const payload = {
        username: userData.username,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };
      await axiosInstance.put("/users/changePassword",payload );
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại!");
      console.error("Change password error:", error);
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    toast.info("Đã đăng xuất!");
  };

  if (!userData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải dữ liệu...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={3} className="border-end">
          <h5 className="fw-bold mb-4">👤 {userData.username}</h5>
          <div className={`mb-3 ${key === "info" ? "text-danger" : ""}`} style={{ cursor: "pointer" }} onClick={() => setKey("info")}>
            Thông tin tài khoản
          </div>
          <div className={`mb-3 ${key === "address" ? "text-danger" : ""}`} style={{ cursor: "pointer" }} onClick={() => setKey("address")}>
            Địa chỉ
          </div>
          <div className={`mb-3 ${key === "password" ? "text-danger" : ""}`} style={{ cursor: "pointer" }} onClick={() => setKey("password")}>
            Đổi mật khẩu
          </div>
          <div className="text-black" style={{ cursor: "pointer" }} onClick={handleLogout}>
            Đăng xuất
          </div>
        </Col>

        <Col md={9}>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            <Tab eventKey="info" title="Thông tin tài khoản">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    value={updateData.fullname || ""}
                    onChange={(e) => setUpdateData({ ...updateData, fullname: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={updateData.email || ""}
                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    value={updateData.phone || ""}
                    onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                  />
                </Form.Group>
                <Button variant="danger" onClick={handleSave}>
                  Lưu
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="address" title="Địa chỉ">
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ giao hàng</Form.Label>
                <Form.Control
                  value={updateData.address || ""}
                  onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                />
              </Form.Group>
              <Button variant="danger" onClick={handleSave}>
                Cập nhật địa chỉ
              </Button>
            </Tab>

            <Tab eventKey="password" title="Đổi mật khẩu">
            <Form.Group className="mb-3">
                <Form.Label>Tên tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.username}
                  onChange={(e) => setPasswordData({ ...userData.username, username: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu cũ</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </Form.Group>
              <Button variant="danger" onClick={handleChangePassword}>
                Đổi mật khẩu
              </Button>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ToastContainer position="top-center" autoClose={1000} />
    </Container>
  );
};

export default ProfilePage;
