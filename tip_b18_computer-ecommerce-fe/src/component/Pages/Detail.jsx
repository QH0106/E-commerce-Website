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

const ProductDetail = () => {
  const [key, setKey] = useState("description");
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ name: "", comment: "" });
  const { id } = useParams();

  useEffect(() => {
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

  const addToCart = (product) => {
    let currentUser;
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      currentUser = userData?.data || userData;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      toast.warning("Đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    if (!currentUser?.id) {
      toast.warning("Vui lòng đăng nhập lại!");
      return;
    }

    const cartItem = {
      userId: currentUser.id,
      productId: product.id,
      quantity: quantity,
    };

    axiosInstance
      .post("/carts/add", cartItem)
      .then((response) => {
        // Kiểm tra response.data tồn tại trước
        if (response.data) {
          toast.success(`${product.name} đã thêm ${quantity} sản phẩm`);
          window.dispatchEvent(new Event("cartUpdated"));
          setQuantity(1);
        } else {
          toast.error("Thêm vào giỏ hàng thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      });
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
    <Container className="py-5">
      <Row style={{ marginLeft: "100px", marginTop: "50px" }}>
        <Col md={5}>
          <Row className="mx-auto">
            <InnerImageZoom
              src={mainImage}
              zoomSrc={mainImage}
              zoomType="hover"
              zoomScale={1}
              alt={product.name}
            />
          </Row>
          <Row className="mt-3 gap-2">
            <Slider {...sliderSettings} style={{ margin: "0 5px 0 5px" }}>
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
                        // border: mainImage === img ? "1px solid orange" : "",
                      }}
                    />
                  </div>
                ))}
            </Slider>
          </Row>
        </Col>
        {/* <Col md={1}></Col> */}
        <Col md={6} style={{ paddingLeft: "70px" }}>
          <h4>{product.name}</h4>
          <h5>Hãng: {product.brand}</h5>
          <h5>Số lượng: {product.quantity}</h5>
          <div className="mb-2">
            <span style={{ color: "#ffc107" }}>★★★★★</span>{" "}
            <span>{product.reviews?.length || 0} đánh giá</span>
          </div>
          <h3 className="text-danger">
            {product.price
              ? product.price.toLocaleString() + "₫"
              : "Đang cập nhật"}
          </h3>

          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="3">
              Số lượng
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="number"
                defaultValue={1}
                value={quantity}
                min={1}
                style={{ width: "80px" }}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Col>
          </Form.Group>

          <ButtonGroup className="mt-3">
            <Button
              className="px-4 py-2"
              onClick={() => addToCart(product)}
              style={{
                backgroundColor: "#E07008",
                width: "330px",
                borderRadius: "20px",
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </ButtonGroup>

          <ul className="mt-4">
            {product.promotions?.map((promo, index) => (
              <li key={index}>{promo}</li>
            ))}
          </ul>

          <div className="mt-4">
            <h4>ƯU ĐÃI KHI MUA KÈM PC:</h4>
            <p className="fs-6">
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
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
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

      <Row className="mt-5">
        <h4>Sản phẩm cùng thương hiệu</h4>
        {relatedProducts.map((p) => (
          <Col md={2} key={p.id} className="mb-6">
            <Card
              onClick={() => (window.location.href = `/Detail/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top mx-auto my-auto pt-2"
                src={p.thumbnail || p.image}
              />
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
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
