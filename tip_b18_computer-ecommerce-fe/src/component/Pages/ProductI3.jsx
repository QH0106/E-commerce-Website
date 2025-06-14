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
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/productI.css";

const ProductI3 = () => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageLoaded, setImageLoaded] = useState({});
  const navigate = useNavigate();
  const pageSize = 100;
  const placeholderImage = "/unnamed.png";

  useEffect(() => {
    axiosInstance
      .get(
        `/products/getAllProducts?page=${page}&size=${pageSize}&sort=false&sortBy=name`
      )
      .then((res) => {
        const i3Products = res.data.filter((p) =>
          p.name.toLowerCase().includes("i3")
        );
        setProducts(i3Products);
      })
      .catch((err) => console.error("Lỗi lấy sản phẩm i3:", err));
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

  const addToCart = (product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
      return;
    }

    const cartItem = {
      userId: currentUser.id,
      productId: product.id,
      quantity: 1,
    };

    axiosInstance
      .post("/carts/add", cartItem)
      .then(() => {
        alert(`${product.name} đã thêm vào giỏ hàng!`);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  const handleClick = (id) => navigate(`/Detail/${id}`);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Sản phẩm CPU Intel Core i3
      </h2>

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
                className="h-100 shadow product-card"
                onClick={() => handleClick(product.id)}
              >
                <div className="image-container">
                  {!imageLoaded[product.id] && (
                    <div className="image-placeholder">
                      <Spinner animation="border" variant="secondary" size="sm" />
                    </div>
                  )}
                  <Card.Img
                    variant="top"
                    src={product.thumbnail || product.image || placeholderImage}
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, [product.id]: true }))
                    }
                    className={`product-image ${
                      imageLoaded[product.id] ? "loaded" : "loading"
                    }`}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fs-6">{product.name}</Card.Title>
                  <Card.Text className="text-danger fw-bold">
                    {product.price.toLocaleString("vi-VN")}₫
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-100"
                    style={{margin:"auto"}}
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
    </Container>
  );
};

export default ProductI3;
