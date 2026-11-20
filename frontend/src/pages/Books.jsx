
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import {
    getBooks,
    createBook,
    getAuthors,
    getCategories,
    updateBook,
    deleteBook
} from '../services/bookService';

import { createBookRequest } from '../services/bookRequestService';

function Books() {
    const { user } = useAuth();

    // Role permissions
    const canManageBooks = ['ADMIN', 'LIBRARIAN'].includes(user?.role);
    const canRequestBooks = user?.role === 'MEMBER';

    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [requestingId, setRequestingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        title: '',
        isbn: '',
        category: '',
        authors: [],
        description: '',
        published_date: ''
    };

    const [form, setForm] = useState(emptyForm);

    // Load books, authors and categories
    const loadData = async () => {
        try {
            setError('');

            const [bookData, authorData, categoryData] =
                await Promise.all([
                    getBooks(),
                    getAuthors(),
                    getCategories()
                ]);

            setBooks(
                Array.isArray(bookData)
                    ? bookData
                    : bookData.results || []
            );

            setAuthors(
                Array.isArray(authorData)
                    ? authorData
                    : authorData.results || []
            );

            setCategories(
                Array.isArray(categoryData)
                    ? categoryData
                    : categoryData.results || []
            );

        } catch (err) {
            console.error(err);
            setError('Unable to load book information.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Reset form
    const resetForm = () => {
        setForm({ ...emptyForm });
        setEditingId(null);
    };

    // Open Add Book modal
    const handleAdd = () => {
        resetForm();
        setShowModal(true);
    };

    // Handle normal input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle multiple authors
    const handleAuthorChange = (e) => {
        const selectedAuthors = Array.from(
            e.target.selectedOptions,
            option => Number(option.value)
        );

        setForm(prev => ({
            ...prev,
            authors: selectedAuthors
        }));
    };

    // Open Edit Book modal
    const handleEdit = (book) => {
        if (!canManageBooks) return;

        setForm({
            title: book.title || '',
            isbn: book.isbn || '',
            category: String(book.category || ''),
            authors: (book.authors || []).map(Number),
            description: book.description || '',
            published_date: book.published_date || ''
        });

        setEditingId(book.id);
        setShowModal(true);
    };

    // Delete Book
    const handelDelete = async (book) => {
        if (!canManageBooks) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${book.title}"?`
        );

        if (!confirmed) return;

        try {
            await deleteBook(book.id);

            alert('Book deleted successfully!');

            await loadData();

        } catch (err) {
            console.error(err);

            alert(
                JSON.stringify(
                    err.response?.data || 'Unable to delete book.'
                )
            );
        }
    };

    // Submit Book Request (MEMBER only)
    const handleBookRequest = async (book) => {
        if (!canRequestBooks) return;

        try {
            setRequestingId(book.id);

            const response = await createBookRequest(book.id);

            alert(
                response.message ||
                'Book request submitted successfully!'
            );

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.error ||
                JSON.stringify(
                    err.response?.data || 'Unable to submit book request.'
                )
            );

        } finally {
            setRequestingId(null);
        }
    };

    // Add or Update Book
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canManageBooks) return;

        setSaving(true);

        try {
            const bookData = {
                ...form,
                category: Number(form.category),
                authors: form.authors.map(Number)
            };

            if (editingId !== null) {
                await updateBook(editingId, bookData);

                alert('Book updated successfully!');
            } else {
                await createBook(bookData);

                alert('Book added successfully!');
            }

            resetForm();
            setShowModal(false);

            await loadData();

        } catch (err) {
            console.error(err);

            alert(
                JSON.stringify(
                    err.response?.data || 'Unable to save book.'
                )
            );

        } finally {
            setSaving(false);
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div>

            {/* Page Heading */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h3 className="fw-bold">Books Management</h3>

                    <p className="text-secondary">
                        Browse and manage library books
                    </p>
                </div>

                {/* Add button only for ADMIN and LIBRARIAN */}
                {canManageBooks && (
                    <button
                        className="btn btn-primary"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Book
                    </button>
                )}

            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Books Table */}
            <div className="card border-0 shadow-sm">

                <div className="card-body table-responsive">

                    <table className="table table-hover align-middle">

                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>ISBN</th>
                                <th>Category</th>
                                <th>Authors</th>

                                {(canManageBooks || canRequestBooks) && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>

                            {books.length > 0 ? (

                                books.map(book => (

                                    <tr key={book.id}>

                                        <td>{book.id}</td>

                                        <td className="fw-semibold">
                                            {book.title}
                                        </td>

                                        <td>{book.isbn}</td>

                                        <td>
                                            {categories.find(
                                                category =>
                                                    category.id === book.category
                                            )?.name || book.category}
                                        </td>

                                        <td>
                                            {Array.isArray(book.authors)
                                                ? book.authors.map(id =>
                                                    authors.find(
                                                        author => author.id === id
                                                    )?.name || id
                                                ).join(', ')
                                                : book.authors}
                                        </td>

                                        {/* Admin and Librarian Actions */}
                                        {canManageBooks && (
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(book)}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handelDelete(book)}
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Delete
                                                </button>
                                            </td>
                                        )}

                                        {/* Member Request Button */}
                                        {canRequestBooks && (
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleBookRequest(book)}
                                                    disabled={requestingId === book.id}
                                                >
                                                    {requestingId === book.id
                                                        ? 'Requesting...'
                                                        : (
                                                            <>
                                                                <i className="bi bi-bookmark-plus me-1"></i>
                                                                Request Book
                                                            </>
                                                        )}
                                                </button>
                                            </td>
                                        )}

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan={
                                            canManageBooks || canRequestBooks ? 6 : 5
                                        }
                                        className="text-center py-4"
                                    >
                                        No books found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Add / Edit Book Modal */}
            {showModal && canManageBooks && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >

                    <div className="modal-dialog modal-lg modal-dialog-centered">

                        <div className="modal-content">

                            {/* Modal Header */}
                            <div className="modal-header">

                                <h5 className="modal-title fw-bold">
                                    {editingId !== null
                                        ? 'Edit Book'
                                        : 'Add New Book'}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>

                            </div>

                            {/* Book Form */}
                            <form onSubmit={handleSubmit}>

                                <div className="modal-body">

                                    <div className="row g-3">

                                        {/* Book Title */}
                                        <div className="col-md-6">

                                            <label className="form-label">
                                                Book Title
                                            </label>

                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                value={form.title}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* ISBN */}
                                        <div className="col-md-6">

                                            <label className="form-label">
                                                ISBN
                                            </label>

                                            <input
                                                type="text"
                                                name="isbn"
                                                className="form-control"
                                                value={form.isbn}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Category */}
                                        <div className="col-md-6">

                                            <label className="form-label">
                                                Category
                                            </label>

                                            <select
                                                name="category"
                                                className="form-select"
                                                value={form.category}
                                                onChange={handleChange}
                                                required
                                            >

                                                <option value="">
                                                    Select Category
                                                </option>

                                                {categories.map(category => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>

                                        {/* Authors */}
                                        <div className="col-md-6">

                                            <label className="form-label">
                                                Authors
                                            </label>

                                            <select
                                                multiple
                                                className="form-select"
                                                value={form.authors.map(String)}
                                                onChange={handleAuthorChange}
                                                required
                                            >

                                                {authors.map(author => (
                                                    <option
                                                        key={author.id}
                                                        value={author.id}
                                                    >
                                                        {author.name}
                                                    </option>
                                                ))}

                                            </select>

                                            <small className="text-secondary">
                                                Hold Ctrl to select multiple authors.
                                            </small>

                                        </div>

                                        {/* Published Date */}
                                        <div className="col-md-6">

                                            <label className="form-label">
                                                Published Date
                                            </label>

                                            <input
                                                type="date"
                                                name="published_date"
                                                className="form-control"
                                                value={form.published_date}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Description */}
                                        <div className="col-12">

                                            <label className="form-label">
                                                Description
                                            </label>

                                            <textarea
                                                name="description"
                                                className="form-control"
                                                rows="3"
                                                value={form.description}
                                                onChange={handleChange}
                                            ></textarea>

                                        </div>

                                    </div>

                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? 'Saving...'
                                            : editingId !== null
                                                ? 'Update Book'
                                                : 'Save Book'}
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

export default Books;
