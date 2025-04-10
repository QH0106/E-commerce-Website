import React, { useState } from "react";
import { Container, Row, Col, Button, Image, Form, Tabs, Tab, ListGroup, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const ProductDetail = () => {
  const [key, setKey] = useState("description");

  return (
    <Container className="py-5">
      <Row>
        {/* Hình ảnh sản phẩm */}
        <Col md={6}>
          <Image src="/public/image-1.png" fluid rounded />
          <Row className="mt-3">
            <Col xs={3}><Image src="/public/image-1.png" thumbnail /></Col>
            <Col xs={3}><Image src="/public/image-1.png" thumbnail /></Col>
            <Col xs={3}><Image src="/public/image-1.png" thumbnail /></Col>
            <Col xs={3}><Image src="/public/image-1.png" thumbnail /></Col>
          </Row>
        </Col>

        {/* Thông tin sản phẩm */}
        <Col md={6}>
          <h4>PC GVN AMD R5-8400F/ VGA RX 7600 (Powered by ASUS)</h4>
          <div className="mb-2">
            <span style={{ color: "#ffc107" }}>
              ★★★★★
            </span>{" "}
            <span>20 đánh giá</span>
          </div>
          <h3 className="text-danger">23.390.000₫</h3>
          <p>
            <del className="text-secondary">25.210.000₫</del> <span className="text-danger">-7%</span>
          </p>

          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="3">
              Số lượng
            </Form.Label>
            <Col sm="9">
              <Form.Control type="number" defaultValue={1} min={1} style={{ width: "80px" }} />
            </Col>
          </Form.Group>

          <ButtonGroup className="mt-3">
            <Button className="px-4 py-2" style={{backgroundColor: "#E07008", width: "331px", borderRadius:"20px"}}>Thêm vào giỏ hàng</Button>
          </ButtonGroup>

          <ul className="mt-4">
            <li>Giảm ngay 200.000đ khi nâng cấp SSD. (Xem thêm)</li>
            <li>Giảm ngay 300.000đ khi mua thêm RAM. (Xem thêm)</li>
            <li>Giảm ngay 300.000đ khi mua Microsoft Office kèm PC. (Xem thêm)</li>
          </ul>

          <div className="mt-4">
            <h6>ƯU ĐÃI KHI MUA KÈM PC</h6>
            <p>⭐ Ưu đãi lên đến 54% khi mua kèm PC</p>
          </div>
        </Col>
      </Row>

      {/* Tabs mô tả, thông số, đánh giá */}
      <Row className="mt-5">
        <Col>
          <Tabs id="product-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            <Tab eventKey="description" title="Mô tả">
              <p>Đây là dòng PC chuyên dành cho gaming và đồ họa, được trang bị VGA RX 7600 cùng CPU AMD R5-8400F, kết hợp với tản nhiệt và thiết kế RGB hiện đại.</p>
            </Tab>
            <Tab eventKey="specs" title="Thông số kỹ thuật">
              <ListGroup variant="flush">
                <ListGroup.Item>CPU: AMD Ryzen 5 8400F</ListGroup.Item>
                <ListGroup.Item>GPU: RX 7600 (Powered by ASUS)</ListGroup.Item>
                <ListGroup.Item>RAM: 16GB DDR4</ListGroup.Item>
                <ListGroup.Item>SSD: 512GB NVMe</ListGroup.Item>
                <ListGroup.Item>Mainboard: ASUS B550</ListGroup.Item>
              </ListGroup>
            </Tab>
            <Tab eventKey="reviews" title="Đánh giá (20)">
              <div>
                <p><strong>Nguyễn Văn A:</strong> Sản phẩm rất tốt, chạy mượt mọi game.</p>
                <p><strong>Trần Thị B:</strong> Giao hàng nhanh, đóng gói chắc chắn.</p>
                <p><strong>Lê Văn C:</strong> Hiệu năng tốt trong tầm giá, rất hài lòng.</p>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Gợi ý sản phẩm liên quan */}
      <Row className="mt-5">
        <Col>
          <h5>Sản phẩm liên quan</h5>
          <Row>
            <Col md={3}><Image src="/public/image-2.png" thumbnail /><p>PC Gaming i5/RTX 4060</p></Col>
            <Col md={3}><Image src="/public/image-3.png" thumbnail /><p>PC Đồ họa Ryzen 7</p></Col>
            <Col md={3}><Image src="/public/image-4.png" thumbnail /><p>Mini PC Văn phòng</p></Col>
            <Col md={3}><Image src="/public/image-5png.png" thumbnail /><p>PC GVN i7/RTX 4070</p></Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
