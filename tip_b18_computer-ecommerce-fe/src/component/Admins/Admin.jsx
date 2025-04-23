import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container, Table, Button, Form, Modal, Pagination, InputGroup, Row, Col
} from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaSyncAlt } from 'react-icons/fa';

// Auth context
const AuthContext = createContext();

// Sidebar
const Sidebar = () => (
  <div className="d-flex flex-column p-3 bg-dark text-white vh-100" style={{ width: '250px' }}>
    <h4 className="mb-4">Admin Panel</h4>
    <ul className="nav flex-column">
      <li className="nav-item"><Link className="nav-link text-white" to="/">Dashboard</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/ProductManagement">Sản phẩm</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/users">Người dùng</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/categories">Danh mục</Link></li>
      <li className="nav-item mt-auto"><LogoutButton /></li>
    </ul>
  </div>
);

// Logout
const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  return <Button variant="danger" onClick={logout}>Đăng xuất</Button>;
};

// Custom hook for pagination and search
const useFetchData = (apiUrl, page, size, searchTerm) => {
  const [data, setData] = useState({ content: [], totalPages: 0 });

  const fetchData = () => {
    let url = `${apiUrl}?page=${page}&size=${size}`;
    if (searchTerm) url += `&search=${searchTerm}`;

    axios.get(url)
      .then(res => setData(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchData(); }, [page, size, searchTerm]);

  return [data, fetchData];
};

// Management Component
const ProductManagement = () => {
  const [page, setPage] = useState(1);
  const size = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const apiUrl = "http://192.168.199.43:8080/api/products/getAllProducts";
  const postUrl = "http://192.168.199.43:8080/api/products";
  const [data, reloadData] = useFetchData(apiUrl, page - 1, size, debouncedSearch);

  const handleAdd = () => {
    axios.post(postUrl, newItem)
      .then(() => {
        setShowModal(false);
        reloadData();
      });
  };

  const handleEdit = () => {
    axios.put(`${postUrl}/${editingItem.id}`, editingItem)
      .then(() => {
        setShowModal(false);
        reloadData();
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${postUrl}/${id}`)
      .then(() => reloadData());
  };

  const openAddModal = () => {
    setNewItem({});
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <Container fluid>
      <h2>Quản lý sản phẩm</h2>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm theo tên sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={reloadData}>Tìm</Button>
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button className="me-2" variant="success" onClick={reloadData}><FaSyncAlt /> Làm mới</Button>
          <Button variant="primary" onClick={openAddModal}><FaPlus /> Thêm sản phẩm</Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Tên</th><th>Giá</th><th>Mô tả</th><th>Hình ảnh</th><th>Danh mục</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td><img src={item.image} alt={item.name} style={{ width: '50px' }} /></td>
              <td>{item.categoryId}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => openEditModal(item)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}><FaTrash /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(data.totalPages)].map((_, i) => (
          <Pagination.Item key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {"name,price,description,image,categoryId".split(",").map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field}</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem ? editingItem[field] || "" : newItem[field] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingItem) {
                      setEditingItem({ ...editingItem, [field]: val });
                    } else {
                      setNewItem({ ...newItem, [field]: val });
                    }
                  }}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={editingItem ? handleEdit : handleAdd}>
            {editingItem ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Admin layout
const AdminLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>{children}</div>
  </div>
);

// AuthProvider
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Main Admin App
const AdminApp = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AdminLayout><h2>Dashboard</h2></AdminLayout>} />
        <Route path="/ProductManagement" element={<AdminLayout><ProductManagement /></AdminLayout>} />
        <Route path="/users" element={<AdminLayout><h2>Quản lý người dùng (sẽ thêm sau)</h2></AdminLayout>} />
        <Route path="/categories" element={<AdminLayout><h2>Quản lý danh mục (sẽ thêm sau)</h2></AdminLayout>} />
        <Route path="/login" element={<h2 className="text-center">Đăng nhập</h2>} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default AdminApp;
