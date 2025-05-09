import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Pagination, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaArrowAltCircleLeft, FaImage } from 'react-icons/fa';
import { Link } from 'react-router';
import axiosInstance from '../Author/axiosInstance';
import './admin/Manage.css'

const ProductManagement = () => {
  const apiUrl = '/products/getAllProducts?page=1&size=100'; 
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', sku: '', description: '', brand: '', price: '', quantity: '', thumbnail:''  });
  const [categories, setCategories] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    productId: '',
    thumbnail: null,
    images: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 100;
const openUploadModal = (productId) => {
  setUploadData({
    productId,
    thumbnail: null,
    images: []
  });
  setShowUploadModal(true);
};

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    axiosInstance.get("/categories/getAllCategories")
      .then(response => setCategories(response.data.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Thêm sản phẩm mới
  const handleAdd = () => {
    axiosInstance.post('/products/add', currentProduct)
      .then(() => {
        alert("đã thêm sản phẩm thành công")
        return axiosInstance.get('/products/getAllProducts');
      })
      .then(response => {
        setProducts(response.data.reverse());
        setShow(false);
        setCurrentProduct({ name: '', sku: '', description: '', brand: '', price: '', quantity: '', thumbnail:'', categoryId: '' });
      })
      .catch(error => console.error('Error adding product:', error));
  };
  
  // Cập nhật sản phẩm
  const handleEdit = () => {
    axiosInstance.put(`/products/${currentProduct.id}`, currentProduct)
    .then(() => {
      alert("Đã sửa sản phẩm thành công");
      return axiosInstance.get('/products/getAllProducts');
    })
    .then(response => {
      setProducts(response.data);
      setShow(false);
      setCurrentProduct({
        name: '', sku: '', description: '', brand: '',
        price: '', quantity: '', thumbnail: '', categoryId: ''
      });
    })
    .catch(error => console.error('Error updating product:', error));
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
      if (!confirmDelete) return;
    axiosInstance.delete(`/products/delete/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  // Mở modal để thêm mới hoặc chỉnh sửa sản phẩm
  const handleShowModal = (product = {
    id: '',
    name: '',
    sku: '',
    description: '',
    brand: '',
    price: '',
    quantity: '',
    thumbnail: '',
    categoryId: '',
    featured: false
  }) => {
    setCurrentProduct(product);
    setIsEditing(product.id); 
    setShow(true);
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUploadImages = async () => {
    const formData = new FormData();
    formData.append('thumbnail', uploadData.thumbnail);
    for (let i = 0; i < uploadData.images.length; i++) {
      formData.append('images', uploadData.images[i]);
    }
  
    try {
      await axiosInstance.put(`/products/${uploadData.productId}/upload`, formData );
      alert("Upload ảnh thành công!");
      setShowUploadModal(false);
      const res = await axiosInstance.get('/products/getAllProducts');
      setProducts(res.data);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Lỗi khi upload ảnh');
    }
  };

  return (
    <Container>
      <Link to="/Admin"><h2 style={{paddingTop:"20px"}}><FaArrowAltCircleLeft />Admin</h2></Link> 
      <h2>Quản lý Sản phẩm</h2>
      <Button variant="primary" onClick={() => handleShowModal()}><FaPlus /> Thêm Sản phẩm</Button>

      <Form className="mt-3 mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead style={{textAlign:"center"}}>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên Sản phẩm</th>
            <th>Id sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody style={{textAlign:"center"}}>
          {currentProducts.map(product => (
            <tr key={product.id}>
              <td>
                <img src={product.thumbnail} alt="thumbnail" style={{ width: '80px', height: 'auto' }} />
              </td>
              <td>{product.name}</td>
              <td>{product.id}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>
              <Button variant="info" onClick={() => openUploadModal(product.id)} id='button' className="me-2"><FaImage /> Upload ảnh</Button>
              <Button variant="warning" onClick={() => handleShowModal(product)}  id='button' className="me-2"><FaEdit /> Sửa</Button>
              <Button variant="danger" onClick={() => handleDelete(product.id)} id='button'  className="me-2"><FaTrash /> Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}/>
        {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => {
          const pageNumber = number + 1;
          if (Math.abs(currentPage - pageNumber) <= 2) {
            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          }
          return null;
        })}
        <Pagination.Next
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))}
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(Math.ceil(filteredProducts.length / productsPerPage))}
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
        />
      </Pagination>

      {/* Modal để Thêm hoặc Sửa sản phẩm */}
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="productName" className="mb-3">
                  <Form.Label>Tên Sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="productsku" className="mb-3">
                  <Form.Label>sku</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProduct.sku}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="productdescription" className="mb-3">
                  <Form.Label>description</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProduct.description}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="productbrand" className="mb-3">
                  <Form.Label>Hãng</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProduct.brand}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="productThumbnail" className="mb-3">
                  <Form.Label>Link ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProduct.thumbnail}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, thumbnail: e.target.value })}
                    placeholder="Nhập URL hình ảnh chính"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="productPrice" className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="productquantity" className="mb-3">
                  <Form.Label>Số lượng trong kho</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentProduct.quantity}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="productCategoryId" className="mb-3">
                  <Form.Label>Danh mục sản phẩm</Form.Label>
                  <Form.Select
                    value={currentProduct.categoryId}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Hủy</Button>
          <Button variant="primary" onClick={isEditing ? handleEdit : handleAdd}>
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Upload ảnh sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Ảnh chính (thumbnail)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setUploadData({ ...uploadData, thumbnail: e.target.files[0] })
              }
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Ảnh phụ (nhiều ảnh)</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setUploadData({ ...uploadData, images: e.target.files })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{justifyContent:"center"}}>
        <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Hủy</Button>
        <Button variant="primary" onClick={handleUploadImages}>Tải lên</Button>
      </Modal.Footer>
    </Modal>

    </Container>
    
  );
};

export default ProductManagement;
