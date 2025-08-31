import { toast } from "react-toastify";
import axiosInstance from "../Author/axiosInstance";

export const Addtocart = (product, quantity = 1) => {
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
    quantity: quantity,
  };

  axiosInstance
    .post("/carts/add", cartItem)
    .then(() => {
      toast.success(`${product.name} đã thêm ${quantity} vào giỏ hàng!`);
      window.dispatchEvent(new Event("cartUpdated"));
    })
    .catch((error) => {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi, vui lòng thử lại!");
    });
};
