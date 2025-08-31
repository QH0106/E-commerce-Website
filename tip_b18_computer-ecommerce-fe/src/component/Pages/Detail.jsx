import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Author/axiosInstance";
import "../Css/detailStyle.css";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  Tabs,
  Tab,
  ListGroup,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/src/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Addtocart } from "./Addtocart";

const ProductDetail = () => {
  const [key, setKey] = useState("description");
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ name: "", comment: "" });
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`/products/getById/${id}`)
      .then((response) => {
        const data = response.data.data;
        setProduct(data);

        const fallbackImage =
          data.images?.[0] || data.thumbnail || "/unnamed.png";
        setMainImage(fallbackImage);

        if (data.brand) {
          axiosInstance
            .get(`/products/getAllProducts`)
            .then((res) => {
              const filtered = res.data.filter(
                (p) => p.brand === data.brand && p.id !== data.id
              );
              setRelatedProducts(filtered.slice(0, 4));
            })
            .catch((err) => console.error("Lỗi khi lấy gợi ý:", err));
        }
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  }, [id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewForm.name && reviewForm.comment) {
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), { ...reviewForm }],
      }));
      setReviewForm({ name: "", comment: "" });
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };

  const responsiveImageStyle = {
    width: "100%",
    height: "auto",
    maxWidth: "500px",
    margin: "0 auto",
  };

  if (!product) {
    return (
      <div
        style={{ height: "100vh", backgroundColor: "gray" }}
        className="d-flex justify-content-center align-items-center"
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-3 py-md-5">
      <Row className="border border-secondary p-2 p-md-4 mx-1 mx-md-5">
        {/* Cột hình ảnh */}
        <Col xs={12} md={5} className="mb-4 mb-md-0">
          <Row
            className="mx-auto border border-secondary rounded-3 p-2 p-md-4"
            style={{
              maxWidth: "500px",
              height: "auto",
              aspectRatio: "1",
            }}
          >
            <InnerImageZoom
              src={mainImage}
              zoomSrc={mainImage}
              zoomType="hover"
              zoomScale={1}
              alt={product.name}
              style={responsiveImageStyle}
            />
          </Row>

          {/* Slider thumbnails */}
          <Row className="mt-3">
            <Slider
              {...sliderSettings}
              responsive={[
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 3,
                  },
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 2,
                  },
                },
              ]}
              style={{ margin: "20px 5px 0 5px" }}
            >
              {[product.thumbnail, ...(product.images || [])]
                .filter(Boolean)
                .map((img, index) => (
                  <div key={index}>
                    <Image
                      src={img}
                      thumbnail
                      onClick={() => setMainImage(img)}
                      style={{
                        cursor: "pointer",
                        border: "1px solid gray",
                        height: "120px",
                        width: "120px",
                        objjectfit: "contain",
                        objectposition: "center",
                        backgroundColor: "#f9f9f9",
                      }}
                    />
                  </div>
                ))}
            </Slider>
          </Row>
        </Col>

        {/* Cột thông tin sản phẩm */}
        <Col xs={12} md={7} className="ps-2 ps-md-5">
          <h4 className="mb-3">{product.name}</h4>
          <h5 className="mb-2">Hãng: {product.brand}</h5>
          <h5 className="mb-2">Số lượng: {product.quantity}</h5>

          {/* Giá và đánh giá */}
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 mb-3">
            <h3 className="text-danger mb-0">
              {product.price
                ? product.price.toLocaleString() + "₫"
                : "Đang cập nhật"}
            </h3>
            <div className="ms-md-3">
              <span style={{ color: "#ffc107" }}>★★★★★</span>
              <span className="ms-2">
                {product.reviews?.length || 0} đánh giá
              </span>
            </div>
          </div>

          {/* Số lượng và nút thêm vào giỏ */}
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column xs={4} md={3}>
              Số lượng
            </Form.Label>
            <Col xs={8} md={9}>
              <Form.Control
                type="number"
                value={quantity}
                min={1}
                style={{ width: "80px" }}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Button
            className="w-100 w-md-auto px-4 py-2 mb-3"
            onClick={() => Addtocart(product, quantity)}
            style={{
              backgroundColor: "#E07008",
              maxWidth: "330px",
              borderRadius: "20px",
            }}
          >
            Thêm vào giỏ hàng
          </Button>

          {/* Ưu đãi */}
          <div className="mt-4">
            <h4 className="h5">ƯU ĐÃI KHI MUA KÈM PC:</h4>
            <div className="fs-6 ps-2">
              {/* ...existing promotions code... */}
              "MÁY BỘ STAR HIỆU SUẤT CAO GIÁ SIÊU HỜI" Tại đây Đến 31.12.2025
              <br />
              TẶNG BỘ QUÀ Trị giá 220.000đ Tại đây gồm:
              <ul>
                <li>✅ Chuột Motospeed F333 Black</li>
                <li>✅ Bàn phím Motospeed K103 Black</li>
                <li>✅ Miếng lót Chuột Star cao cấp</li>
              </ul>
              Mua kèm windows 11 pro Tại đây giá chỉ 990.000đ
              <br />
              Giảm 100.000đ mua kèm LCD Tại đây
              <br />
              Giảm lên đến 500.000đ mua kèm Phần mềm, máy in, UPS Tại đây
              <br />
              Giảm lên đến 400.000đ mua kèm GEAR, Ghế Tại đây
              <br />
              Miễn phí vận chuyển lên đến 100k Tại đây
              <br />
              Miễn phí lắp đặt cài đặt Tại đây
            </div>
          </div>
        </Col>
      </Row>

      {/* Tabs section */}
      <Row className="mt-4 mx-1 mx-md-5">
        <Col>
          <Tabs
            id="product-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="description" title="Mô tả">
              <p>{product.description}</p>
            </Tab>
            {/* <Tab eventKey="specs" title="Thông số kỹ thuật">
              <ListGroup variant="flush">
                {product.specs?.map((spec, index) => (
                  <ListGroup.Item key={index}>{spec}</ListGroup.Item>
                ))}
              </ListGroup>
            </Tab> */}
            <Tab
              eventKey="reviews"
              title={`Đánh giá (${product.reviews?.length || 0})`}
            >
              <div>
                {product.reviews?.map((review, index) => (
                  <p key={index}>
                    <strong>{review.name}:</strong> {review.comment}
                  </p>
                ))}

                <Form onSubmit={handleReviewSubmit} className="mt-3">
                  <Form.Group>
                    <Form.Label>Tên bạn</Form.Label>
                    <Form.Control
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Nhận xét</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="mt-2">
                    Gửi đánh giá
                  </Button>
                </Form>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Related products */}
      <Row className="mt-4 mx-1 mx-md-5">
        <h4 className="mb-3">Sản phẩm cùng thương hiệu</h4>
        {relatedProducts.map((p) => (
          <Col xs={6} sm={4} md={3} lg={2} key={p.id} className="mb-3">
            <Card
              onClick={() => (window.location.href = `/Detail/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src={p.thumbnail || p.image}
                className="p-2"
                style={{ aspectRatio: "1", objectFit: "contain" }}
              />
              <Card.Body>
                <Card.Title className="h6">{p.name}</Card.Title>
                <Card.Text className="text-danger">
                  {p.price.toLocaleString()}₫
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeButton={false}
      />
    </Container>
  );
};

export default ProductDetail;
