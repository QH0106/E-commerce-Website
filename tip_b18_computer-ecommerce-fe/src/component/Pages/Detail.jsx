import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container, Row, Col, Button, Image, Form, Tabs, Tab, ListGroup, ButtonGroup
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetail = () => {
  const [key, setKey] = useState("description");
  const [product, setProduct] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://192.168.199.43:8080/api/products/getById/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error("Lỗi khi lấy sản phẩm:", error));
  }, [id]);

  if (!product) {
    return <p>Đang tải sản phẩm...</p>;
  }

  return (
    <Container className="py-5">
      <Row>
        {/* Hình ảnh sản phẩm */}
        <Col md={6}>
          <Image src={product.images} fluid rounded />
          <Row className="mt-3">
            {product.images?.map((img, index) => (
              <Col xs={3} key={index}>
                <Image src={img} thumbnail />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Thông tin sản phẩm */}
        <Col md={6}>
          <h4>{product.name}</h4>
          <div className="mb-2">
            <span style={{ color: "#ffc107" }}>★★★★★</span>{" "}
            {/* <span>{product.reviews?.length || 0} đánh giá</span> */}
          </div>
          <h3 className="text-danger">
            {product.price ? product.price.toLocaleString() + "₫" : "Đang cập nhật"}
          </h3>
          <p>
            {/* <del className="text-secondary">{product.oldPrice.toLocaleString()}₫</del>{" "} */}
            {/* <span className="text-danger">-{product.discount}%</span> */}
          </p>

          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="3">Số lượng</Form.Label>
            <Col sm="9">
              <Form.Control type="number" defaultValue={1} min={1} style={{ width: "80px" }} />
            </Col>
          </Form.Group>

          <ButtonGroup className="mt-3">
            <Button className="px-4 py-2" style={{ backgroundColor: "#E07008", width: "331px", borderRadius: "20px" }}>
              Thêm vào giỏ hàng
            </Button>
          </ButtonGroup>

          <ul className="mt-4">
            {product.promotions?.map((promo, index) => (
              <li key={index}>{promo}</li>
            ))}
          </ul>

          <div className="mt-4">
            <h6>ƯU ĐÃI KHI MUA KÈM PC</h6>
            <p>{product.extraOffer}</p>
          </div>
        </Col>
      </Row>

      {/* Tabs mô tả, thông số, đánh giá */}
      <Row className="mt-5">
        <Col>
          <Tabs id="product-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            <Tab eventKey="description" title="Mô tả">
              <p>{product.description}</p>
            </Tab>
            <Tab eventKey="specs" title="Thông số kỹ thuật">
              <ListGroup variant="flush">
                {product.specs?.map((spec, index) => (
                  <ListGroup.Item key={index}>{spec}</ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>
            <Tab eventKey="reviews" title={`Đánh giá (${product.reviews?.length || 0})`}>
              <div>
                {product.reviews?.map((review, index) => (
                  <p key={index}><strong>{review.name}:</strong> {review.comment}</p>
                ))}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
