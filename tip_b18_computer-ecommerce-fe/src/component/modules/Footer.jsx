import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "../Css/footer.css"

function Footer() {
  return (
    <footer className="footer-section text-white">
      <Container>
        <Row className="py-5">
          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-danger mb-4">Về Computershop</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><a href="#" className="footer-link">Giới thiệu</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Tuyển dụng</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Tin tức</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Đối tác</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-danger mb-4">Chính Sách</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><a href="#" className="footer-link">Chính sách bảo hành</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Chính sách vận chuyển</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Chính sách đổi trả</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Chính sách bảo mật</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-danger mb-4">Hỗ Trợ</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><a href="#" className="footer-link">Hướng dẫn mua hàng</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Hướng dẫn thanh toán</a></li>
              <li className="mb-2"><a href="#" className="footer-link">FAQ</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Tra cứu đơn hàng</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-danger mb-4">Kết Nối</h5>
            <div className="social-links mb-3">
              <a href="#" className="social-link me-2"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" className="social-link me-2"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="social-link me-2"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </Col>
        </Row>
        <div className="text-center py-3 border-top border-secondary">
          <p className="mb-0 text-white">&copy; 2025 Computershop.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;