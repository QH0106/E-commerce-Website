import React, { useEffect, useState } from "react";
import axiosInstance from "../Author/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Pagination,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Addtocart } from "./Addtocart";

const ProductI7 = () => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState("name"); // default
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    axiosInstance
      .get(
        `/products/getAllProducts?page=${page}&size=100&sort=false&sortBy=name`
      )
      .then((res) => {
        const i5Products = res.data.filter((p) =>
          p.name.toLowerCase().includes("i7")
        );
        setProducts(i5Products);
      })
      .catch((err) => console.error("Lỗi lấy sản phẩm i7:", err));
  }, [page]);

  useEffect(() => {
    let sorted = [...products];
    switch (sortOption) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
    setTotalPages(Math.ceil(sorted.length / pageSize));
  }, [products, sortOption]);

  const handleClick = (id) => navigate(`/Detail/${id}`);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Sản phẩm CPU Intel Core i7</h2>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
          >
            <option value="name">Sắp xếp theo tên (A-Z)</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {sortedProducts
          .slice((page - 1) * pageSize, page * pageSize)
          .map((product) => (
            <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
              <Card
                className="h-100 shadow-sm"
                onClick={() => handleClick(product.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src={product.thumbnail || product.image}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-danger">
                    {product.price.toLocaleString("vi-VN")}₫
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      Addtocart(product);
                    }}
                  >
                    Thêm vào giỏ
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.Prev
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === page}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          />
        </Pagination>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeButton={false}
      />
    </Container>
  );
};

export default ProductI7;
