import { useEffect, useState } from 'react';
import {
    getBookCopies,
    createBookCopy,
    updateBookCopy,
    deleteBookCopy
} from '../services/bookCopyService';
import { getBooks } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

function BookCopies() {
    const { user } = useAuth();

    const canManageCopies = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    const [copies, setCopies] = useState([]);
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        book: '',
        barcode: '',
        status: 'AVAILABLE'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [copyData, bookData] = await Promise.all([
                getBookCopies(),
                getBooks()
            ]);

            setCopies(Array.isArray(copyData) ? copyData : copyData.results || []);
            setBooks(Array.isArray(bookData) ? bookData : bookData.results || []);
        } catch (err) {
            console.error(err);
            alert('Unable to load book copies.');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            book: '',
            barcode: '',
            status: 'AVAILABLE'
        });
        setShowModal(true);
    };

    const handleEdit = (copy) => {
        setEditingId(copy.id);
        setFormData({
            book: copy.book,
            barcode: copy.barcode,
            status: copy.status
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
                await updateBookCopy(editingId, formData);
                alert('Book copy updated successfully!');
            } else {
                await createBookCopy(formData);
                alert('Book copy added successfully!');
            }

            setShowModal(false);
            setEditingId(null);
            await loadData();
        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to save book copy.'
            ));
        }
    };

    const handleDelete = async (copy) => {
        if (!canManageCopies) return;

        const confirmed = window.confirm(
            `Delete copy "${copy.barcode}"?`
        );

        if (!confirmed) return;

        try {
            await deleteBookCopy(copy.id);
            alert('Book copy deleted successfully!');
            await loadData();
        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to delete book copy.'
            ));
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3>Book Copies</h3>
                    <p className="text-muted mb-0">
                        Manage individual copies of books.
                    </p>
                </div>

                {canManageCopies && (
                    <button
                        className="btn btn-success"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Copy
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
                                    <th>Book</th>
                                    <th>Barcode</th>
                                    <th>Status</th>
                                    {canManageCopies && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {copies.length > 0 ? (
                                    copies.map((copy) => (
                                        <tr key={copy.id}>
                                            <td>{copy.id}</td>
                                            <td>
                                                {copy.book_title || 'Book'}
                                            </td>
                                            <td>{copy.barcode}</td>
                                            <td>
                                                <span className={`badge ${
                                                    copy.status === 'AVAILABLE'
                                                        ? 'bg-success'
                                                        : 'bg-secondary'
                                                }`}>
                                                    {copy.status}
                                                </span>
                                            </td>

                                            {canManageCopies && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleEdit(copy)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        onClick={() => handleDelete(copy)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canManageCopies ? 5 : 4}
                                            className="text-center text-muted"
                                        >
                                            No book copies found.
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
                                        {editingId ? 'Edit Book Copy' : 'Add Book Copy'}
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
                                            Select Book
                                        </label>

                                        <select
                                            className="form-select"
                                            name="book"
                                            value={formData.book}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Choose a book</option>

                                            {books.map((book) => (
                                                <option
                                                    key={book.id}
                                                    value={book.id}
                                                >
                                                    {book.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Barcode
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="barcode"
                                            value={formData.barcode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Status
                                        </label>

                                        <select
                                            className="form-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="AVAILABLE">Available</option>
                                            <option value="ISSUED">Issued</option>
                                            <option value="LOST">Lost</option>
                                            <option value="DAMAGED">Damaged</option>
                                        </select>
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
                                        {editingId ? 'Update Copy' : 'Save Copy'}
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

export default BookCopies;