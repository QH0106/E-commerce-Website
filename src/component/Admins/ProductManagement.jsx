import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ProductManagement = () => {
  const apiUrl = 'http://192.168.199.43:8080/api/products/getAllProducts?page=1&size=10&sort=false&sortBy=name'; 
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Xác định có đang chỉnh sửa không
  const [currentProduct, setCurrentProduct] = useState({ name: '', sku: '', description: '', brand: '', price: '', quantity: '', thumbnail:''  });

  // Lấy danh sách sản phẩm
  useEffect(() => {
    axios.get(apiUrl)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Thêm sản phẩm mới
  const handleAdd = () => {
    axios.post(apiUrl, currentProduct)
      .then(response => {
        setProducts([...products, response.data]); // Thêm sản phẩm vào danh sách
        setShow(false);
        setCurrentProduct({ name: '', sku: '', description: '', brand: '', price: '', quantity: '', thumbnail:'' });
      })
      .catch(error => console.error('Error adding product:', error));
  };

  // Cập nhật sản phẩm
  const handleEdit = () => {
    axios.put(`${apiUrl}/${currentProduct.name}`, currentProduct)
      .then(response => {
        setProducts(products.map(product => product.name === currentProduct.name ? response.data : product));
        setShow(false);
        setCurrentProduct({name: '', sku: '', description: '', brand: '', price: '', quantity: '', thumbnail:'' });
      })
      .catch(error => console.error('Error updating product:', error));
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id)); // Xóa sản phẩm khỏi danh sách
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  // Mở modal để thêm mới hoặc chỉnh sửa sản phẩm
  const handleShowModal = (product = { name: '', sku: '', description: '', brand: '', price: '', quantity: '', thumbnail:'' }) => {
    setCurrentProduct(product);
    setIsEditing(!!product.name); 
    setShow(true);
  };

  return (
    <Container>
      <h2>Quản lý Sản phẩm</h2>
      <Button variant="primary" onClick={() => handleShowModal()}><FaPlus /> Thêm Sản phẩm</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên Sản phẩm</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.images}>
              <td>{product.images}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(product)} className="me-2"><FaEdit /> Sửa</Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)}><FaTrash /> Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal để Thêm hoặc Sửa sản phẩm */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="productName">
              <Form.Label>Tên Sản phẩm</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="productsku">
              <Form.Label>sku</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.sku}
                onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
              />
            </Form.Group><Form.Group controlId="productdescription">
              <Form.Label>description</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              />
            </Form.Group><Form.Group controlId="productbrand">
              <Form.Label>Hãng</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
              />
            </Form.Group><Form.Group controlId="productPrice">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Hủy</Button>
          <Button variant="primary" onClick={isEditing ? handleEdit : handleAdd}>
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductManagement;
