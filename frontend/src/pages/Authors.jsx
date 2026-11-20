import { useEffect, useState } from 'react';
import {
    getAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor
} from '../services/authorService';
import { useAuth } from '../context/AuthContext';

function Authors() {
    const { user } = useAuth();

    const canManageAuthors = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    const [authors, setAuthors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        biography: ''
    });

    useEffect(() => {
        loadAuthors();
    }, []);

    const loadAuthors = async () => {
        try {
            const data = await getAuthors();
            setAuthors(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error(err);
            alert('Unable to load authors.');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ name: '', biography: '' });
        setShowModal(true);
    };

    const handleEdit = (author) => {
        setEditingId(author.id);
        setFormData({
            name: author.name,
            biography: author.biography || ''
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
                await updateAuthor(editingId, formData);
                alert('Author updated successfully!');
            } else {
                await createAuthor(formData);
                alert('Author added successfully!');
            }

            setShowModal(false);
            setEditingId(null);
            await loadAuthors();
        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to save author.'
            ));
        }
    };

    const handleDelete = async (author) => {
        if (!canManageAuthors) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${author.name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteAuthor(author.id);
            alert('Author deleted successfully!');
            await loadAuthors();
        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to delete author.'
            ));
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3>Authors Management</h3>
                    <p className="text-muted mb-0">
                        Manage book authors.
                    </p>
                </div>

                {canManageAuthors && (
                    <button
                        className="btn btn-success"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Author
                    </button>
                )}
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Biography</th>
                                    {canManageAuthors && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {authors.length > 0 ? (
                                    authors.map((author) => (
                                        <tr key={author.id}>
                                            <td>{author.id}</td>
                                            <td className="fw-semibold">
                                                {author.name}
                                            </td>
                                            <td>
                                                {author.biography || '-'}
                                            </td>

                                            {canManageAuthors && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleEdit(author)}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        onClick={() => handleDelete(author)}
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
                                            colSpan={canManageAuthors ? 4 : 3}
                                            className="text-center text-muted"
                                        >
                                            No authors found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingId ? 'Edit Author' : 'Add Author'}
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
                                            Author Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter author name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Biography
                                        </label>

                                        <textarea
                                            className="form-control"
                                            name="biography"
                                            value={formData.biography}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Enter author biography"
                                        ></textarea>
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
                                        {editingId ? 'Update Author' : 'Save Author'}
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

export default Authors;