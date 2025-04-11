import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { createContext, useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const AuthContext = createContext();

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

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  return <Button variant="danger" onClick={logout}>Đăng xuất</Button>;
};

const useFetchData = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [url]);

  return [data, setData];
};

const ManagementComponent = ({ title, apiUrl, fields }) => {
  const [data, setData] = useFetchData(apiUrl);
  const [show, setShow] = useState(false);
  const [newItem, setNewItem] = useState({});

  const handleAdd = () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(data => setData([...data, data]));
    setShow(false);
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(() => setData(data.filter(item => item.id !== id)));
  };

  return (
    <Container>
      <h2>{title}</h2>
      <Button variant="primary" onClick={() => setShow(true)}><FaPlus /> Thêm {title}</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            {fields.map(field => <th key={field}>{field}</th>)}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {fields.map(field => <td key={field}>{item[field]}</td>)}
              <td>
                <Button variant="warning" className="me-2"><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}><FaTrash /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {fields.map(field => (
              <Form.Group key={field}>
                <Form.Label>{field}</Form.Label>
                <Form.Control type="text" onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })} />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleAdd}><FaPlus /> Thêm</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const AdminLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>{children}</div>
  </div>
);

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

const AdminApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<AdminLayout><h2>Dashboard</h2></AdminLayout>} />
      <Route path="/ProductManagement" element={<AdminLayout><ManagementComponent title="Sản phẩm" apiUrl="http://192.168.199.43:8080/api/products/getAllProducts?page=1&size=10&sort=false&sortBy=name" fields={["id", "name", "price"]} /></AdminLayout>} />
      <Route path="/users" element={<AdminLayout><ManagementComponent title="Người dùng" apiUrl="http://localhost:5000/api/users" fields={["id", "username", "email"]} /></AdminLayout>} />
      <Route path="/categories" element={<AdminLayout><ManagementComponent title="Danh mục" apiUrl="http://localhost:5000/api/categories" fields={["id", "name"]} /></AdminLayout>} />
      <Route path="/login" element={<h2 className="text-center">Đăng nhập</h2>} />
    </Routes>
  </AuthProvider>
);

export default AdminApp;
