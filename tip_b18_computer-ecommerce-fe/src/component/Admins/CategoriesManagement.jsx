import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router";
import axiosInstance from "../Author/axiosInstance";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: "",
    name: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axiosInstance
      .get("/categories/getAllCategories")
      .then((response) => setCategories(response.data.data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleAdd = () => {
    axiosInstance
      .post("/categories/add", currentCategory)
      .then(() => {
        alert("Thêm danh mục thành công");
        fetchCategories();
        setShow(false);
        setCurrentCategory({ id: "", name: "", description: "" });
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  const handleEdit = () => {
    axiosInstance
      .put(`/categories/update/${currentCategory.id}`, currentCategory)
      .then(() => {
        alert("Cập nhật danh mục thành công");
        fetchCategories();
        setShow(false);
        setCurrentCategory({ id: "", name: "", description: "" });
      })
      .catch((error) => console.error("Error updating category:", error));
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này không?"
    );
    if (!confirmDelete) return;

    axiosInstance
      .delete(`/categories/deleteCategory/${id}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  const handleShowModal = (category = { id: "", name: "" }) => {
    setCurrentCategory(category);
    setIsEditing(category.id);
    setShow(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Link to="/Admin">
        <h2 style={{ paddingTop: "20px" }}>
          <FaArrowAltCircleLeft />
          Admin
        </h2>
      </Link>
      <h2>Quản lý Danh mục</h2>
      <Button variant="primary" onClick={() => handleShowModal()}>
        <FaPlus /> Thêm Danh mục
      </Button>

      <Form className="mt-3 mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên danh mục..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>Tên danh mục</th>
            <th>ID</th>
            <th>Phân Loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {currentCategories.map((category) => (
            <tr key={category.id} style={{ verticalAlign: "middle" }}>
              <td>{category.name}</td>
              <td>{category.id}</td>
              <td>{category.type}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(category)}
                  className="me-2"
                  style={{ margin: "auto", marginBottom: "5px" }}
                >
                  <FaEdit /> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(category.id)}
                  className="me-2"
                  style={{ margin: "auto" }}
                >
                  <FaTrash /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} />
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
        {[
          ...Array(
            Math.ceil(filteredCategories.length / categoriesPerPage)
          ).keys(),
        ].map((number) => {
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
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredCategories.length / categoriesPerPage)
              )
            )
          }
          disabled={
            currentPage ===
            Math.ceil(filteredCategories.length / categoriesPerPage)
          }
        />
        <Pagination.Last
          onClick={() =>
            setCurrentPage(
              Math.ceil(filteredCategories.length / categoriesPerPage)
            )
          }
          disabled={
            currentPage ===
            Math.ceil(filteredCategories.length / categoriesPerPage)
          }
        />
      </Pagination>

      {/* Modal thêm/sửa danh mục */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Sửa Danh mục" : "Thêm Danh mục"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Tên Danh mục</Form.Label>
              <Form.Control
                type="text"
                value={currentCategory.name}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="categoryType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                value={currentCategory.type}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    type: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleEdit : handleAdd}
          >
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoriesManagement;
