import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../Author/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import AOS from "aos";
import "swiper/css";
import "swiper/css/navigation";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/Homepage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "/products/getAllProducts?page=1&size=100"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    let currentUser;
    try {
      currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return;
    }

    if (!currentUser) {
      toast.warning("Đăng nhập để thêm sản phẩm vào giỏ hàng!");
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
        toast.success(`${product.name} đã thêm vào giỏ hàng!`);
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  return (
    <div className="PageHm">
      <div className="bannerH">
        <div className="slideshow">
          <Carousel className="slide">
            <Carousel.Item>
              <a href="/ProDuct">
                <img
                  src="/banner1.jpg"
                  alt="slide 1"
                  className="d-block"
                  id="item"
                />
              </a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="/ProDuct">
                <img src="/banner2.jpg" className="d-block" id="item" />
              </a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="/ProDuct">
                <img
                  src="/banner3.jpg"
                  alt="slide 3"
                  className="d-block"
                  id="item"
                />
              </a>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      <div className="container py-5">
        <div
          className="card p-4 text-center"
          style={{ backgroundColor: "#f1f1f1", border: "none" }}
        >
          <div className="col-12" data-aos="fade-up">
            <h3 className="display-4">
              Chào mừng bạn đến với Computershop - cửa hàng thương mại điện tử
              chuyên cung cấp máy tính, linh kiện và thiết bị công nghệ chất
              lượng cao!
            </h3>
          </div>
          <div className="col-12" data-aos="fade-up">
            <p>
              Tại Computershop, chúng tôi hiểu rằng mỗi khách hàng đều có nhu
              cầu riêng biệt - từ cấu hình máy văn phòng tiết kiệm cho đến dàn
              PC gaming mạnh mẽ, workstation cho dân thiết kế hay máy chủ hiệu
              suất cao. Vì vậy, chúng tôi mang đến danh mục sản phẩm phong phú,
              chính hãng 100%, cùng chính sách giá cạnh tranh và hỗ trợ tư vấn
              tận tâm.
            </p>
          </div>
          <div className="col-12" data-aos="fade-up">
            <p>
              Với giao diện website thân thiện, dễ sử dụng, bạn có thể dễ dàng
              tìm kiếm, so sánh và đặt hàng chỉ trong vài bước đơn giản. Các
              tính năng như giỏ hàng, thanh toán trực tuyến bảo mật, theo dõi
              đơn hàng và hỗ trợ kỹ thuật 24/7 sẽ mang đến trải nghiệm mua sắm
              chuyên nghiệp và tiện lợi nhất.
            </p>
          </div>
          <div className="col-12" data-aos="fade-up">
            <p>
              Hơn cả một cửa hàng, Computershop là nơi bạn có thể yên tâm xây
              dựng hệ thống máy tính tối ưu cho công việc, học tập hay giải trí.
              Chúng tôi luôn đồng hành cùng bạn trên hành trình công nghệ -
              nhanh chóng, uy tín và chất lượng.
            </p>
          </div>
        </div>
      </div>

      <section className="py-5 bg-light" data-aos="fade-up">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-truck text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
                <div className="ms-3">
                  <h5 className="mb-0">Giao hàng miễn phí</h5>
                  <p className="mb-0 text-muted small">
                    Cho đơn hàng trên 1 triệu
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-shield-check text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
                <div className="ms-3">
                  <h5 className="mb-0">Bảo hành chính hãng</h5>
                  <p className="mb-0 text-muted small">Lên đến 36 tháng</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-arrow-repeat text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
                <div className="ms-3">
                  <h5 className="mb-0">Đổi trả 30 ngày</h5>
                  <p className="mb-0 text-muted small">Nếu sản phẩm lỗi</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-headset text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
                <div className="ms-3">
                  <h5 className="mb-0">Hỗ trợ 24/7</h5>
                  <p className="mb-0 text-muted small">Luôn sẵn sàng giúp đỡ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <div className="container mt-3">
        <h2
          className="signature border-bottom border-secondary"
          style={{ textAlign: "center", marginBottom: "50px" }}
          data-aos="fade-left"
        >
          Sản phẩm nổi bật
        </h2>
        {loading ? (
          <div
            style={{ height: "100px" }}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="spinner-border text-wanning" role="status">
              <span className="visually-hidden"></span>
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={4}
            navigation
          >
            {products.slice(0, 12).map((product) => (
              <SwiperSlide key={product.name}>
                <div
                  id="card"
                  className="card p-2"
                  style={{
                    backgroundColor: "#F8F4F4",
                    marginTop: "10px",
                    textDecoration: "none",
                    width: "80%",
                  }}
                >
                  <Link to={`/Detail/${product.id}`}>
                    <img
                      className="card-img-top"
                      src={product.thumbnail}
                      alt={product.name}
                      style={{ marginLeft: "25px" }}
                    />
                  </Link>
                  <h5
                    style={{
                      marginLeft: "25px",
                      whiteSpace: "nowrap", // chỉ hiện trên 1 hàng
                      overflow: "hidden", // ẩn phần xuống hàng
                      textOverflow: "ellipsis", // hiện ...
                      width: "190px",
                    }}
                  >
                    {product.name}
                  </h5>
                  {/* <div style={{display: "flex"}}>
                    <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px" }}>{product.old}</p>
                    <p style={{color: "#BC1616"}}>{product.sale}</p>
                  </div> */}
                  <p style={{ color: "red", marginLeft: "25px" }}>
                    Giá: {product.price}
                  </p>
                  <button
                    className="btncard"
                    onClick={() => addToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Sản phẩm khuyến mãi */}
      <div className="container mt-3">
        <h2
          className="signature border-bottom border-secondary"
          style={{
            textAlign: "center",
            marginBottom: "50px",
            marginTop: "50px",
          }}
          data-aos="fade-up"
        >
          Sản phẩm{" "}
        </h2>
        {loading ? (
          <div
            style={{ height: "100px" }}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="spinner-border text-wanning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {products.slice(7, 15).map((product) => (
              <div
                key={product.name}
                className="col-md-3"
                style={{ fontSize: "15px" }}
                title={product.name}
              >
                <div
                  className="card p-3 sales"
                  style={{ backgroundColor: "#F8F4F4", marginTop: "10px" }}
                >
                  <Link to={`/Detail/${product.id}`}>
                    <img
                      className="card-img-top"
                      src={product.thumbnail}
                      alt={product.name}
                      style={{ marginLeft: "25px" }}
                    />
                  </Link>
                  <h5
                    style={{
                      marginLeft: "25px",
                      whiteSpace: "nowrap", // chỉ hiện trên 1 hàng
                      overflow: "hidden", // ẩn phần xuống hàng
                      textOverflow: "ellipsis", // hiện ...
                      width: "200px",
                    }}
                  >
                    {product.name}
                  </h5>

                  <p
                    style={{
                      color: "red",
                      marginLeft: "25px",
                      fontSize: "1rem",
                    }}
                  >
                    Giá: {product.price}
                  </p>
                  <button
                    className="btncard"
                    onClick={() => addToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        closeButton={false}
      />
    </div>
  );
};

export default HomePage;
