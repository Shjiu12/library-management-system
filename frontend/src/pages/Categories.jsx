import { useEffect, useState } from 'react';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../services/categoryService';

import { useAuth } from '../context/AuthContext';

function Categories() {
    const { user } = useAuth();

    const canManageCategories = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();

            setCategories(
                Array.isArray(data) ? data : data.results || []
            );
        } catch (err) {
            console.error(err);
            alert('Unable to load categories.');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ name: '' });
        setShowModal(true);
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateCategory(editingId, formData);
                alert('Category updated successfully!');
            } else {
                await createCategory(formData);
                alert('Category added successfully!');
            }

            setShowModal(false);
            setEditingId(null);
            await loadCategories();

        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to save category.'
            ));
        }
    };

    const handleDelete = async (category) => {
        if (!canManageCategories) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteCategory(category.id);
            alert('Category deleted successfully!');
            await loadCategories();

        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to delete category.'
            ));
        }
    };

    return (
        <div className="container-fluid">

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3>Categories Management</h3>
                    <p className="text-muted mb-0">
                        Manage your library book categories.
                    </p>
                </div>

                {canManageCategories && (
                    <button
                        className="btn btn-success"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Category
                    </button>
                )}
            </div>

            {/* Categories Table */}
            <div className="card shadow-sm">
                <div className="card-body">

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">

                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Category Name</th>

                                    {canManageCategories && (
                                        <th>Actions</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.id}</td>

                                            <td className="fw-semibold">
                                                {category.name}
                                            </td>

                                            {canManageCategories && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        onClick={() => handleDelete(category)}
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canManageCategories ? 3 : 2}
                                            className="text-center text-muted"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <form onSubmit={handleSubmit}>

                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingId
                                            ? 'Edit Category'
                                            : 'Add Category'}
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Category Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter category name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        {editingId
                                            ? 'Update Category'
                                            : 'Save Category'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Categories;