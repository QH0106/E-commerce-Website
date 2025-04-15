import React from 'react'
import "../Css/Homepage.css"

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="text-black text-center p-3 mt-4">
        <p>LOGONAME</p>
        <div>
          <ul>
            <li>Hệ thống cửa hàng</li>
            <li>Hướng dẫn mua hàng</li>
            <li>Hướng dẫn thanh toán</li>
            <li>Hướng dẫn trả góp</li>
            <li>Tra cứu địa chỉ bảo hành</li>
          </ul>
        </div>
        <div>
          <ul>HỖ TRỢ KHÁCH HÀNG:
            <li>Chính sách đổi trả</li>
            <li>Chính sách khách hàng thân thiết</li>
            <li>Giao hàng & phí giao hàng</li>
            <li> Chính sách bảo mật thông tin</li>
            <li> Chính sách đại lý</li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

export default Footer