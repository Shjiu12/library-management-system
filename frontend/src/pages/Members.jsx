
import { useEffect, useState } from 'react';
import {
    getMembers,
    createMember,
    updateMember,
    deleteMember
} from '../services/memberService';

import { useAuth } from '../context/AuthContext';

function Members() {
    const { user } = useAuth();

    const canManageMembers = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await getMembers();
            console.log('members API respose:',data);
            setMembers(
                Array.isArray(data) ? data : data.results || []
            );
        } catch (err) {
            console.error(err);
            alert('Unable to load members.');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            phone: '',
            address: ''
        });
        setShowModal(true);
    };

    const handleEdit = (member) => {
        setEditingId(member.id);
        setFormData({
            username: member.username,
            email: member.email,
            password: '',
            phone: member.phone || '',
            address: member.address || ''
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
            const data = { ...formData };

            // Password is optional when updating.
            if (editingId && !data.password) {
                delete data.password;
            }

            if (editingId) {
                await updateMember(editingId, data);
                alert('Member updated successfully!');
            } else {
                await createMember(data);
                alert('Member created successfully!');
            }

            setShowModal(false);
            setEditingId(null);
            await loadMembers();

        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to save member.'
            ));
        }
    };

    const handleDelete = async (member) => {
        if (!canManageMembers) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete member "${member.username}"?`
        );

        if (!confirmed) return;

        try {
            await deleteMember(member.id);
            alert('Member deleted successfully!');
            await loadMembers();

        } catch (err) {
            console.error(err);
            alert(JSON.stringify(
                err.response?.data || 'Unable to delete member.'
            ));
        }
    };

    return (
        <div className="container-fluid">

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3>Members Management</h3>
                    <p className="text-muted mb-0">
                        Manage library member information.
                    </p>
                </div>

                {canManageMembers && (
                    <button
                        className="btn btn-success"
                        onClick={handleAdd}
                    >
                        <i className="bi bi-person-plus me-2"></i>
                        Add Member
                    </button>
                )}
            </div>

            {/* Members Table */}
            <div className="card shadow-sm">
                <div className="card-body">

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">

                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Joined Date</th>

                                    {canManageMembers && (
                                        <th>Actions</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.id}</td>
                                            <td className="fw-semibold">
                                                {member.username}
                                            </td>
                                            <td>{member.email}</td>
                                            <td>{member.phone || '-'}</td>
                                            <td>{member.address || '-'}</td>
                                            <td>{member.joined_date}</td>

                                            {canManageMembers && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleEdit(member)}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        onClick={() => handleDelete(member)}
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
                                            colSpan={canManageMembers ? 7 : 6}
                                            className="text-center text-muted"
                                        >
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Member Modal */}
            {showModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                            <form onSubmit={handleSubmit}>

                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingId ? 'Edit Member' : 'Add Member'}
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            {editingId
                                                ? 'New Password (optional)'
                                                : 'Password'}
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            minLength="8"
                                            required={!editingId}
                                            placeholder={
                                                editingId
                                                    ? 'Leave blank to keep current password'
                                                    : 'Enter password'
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Address
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
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
                                        {editingId
                                            ? 'Update Member'
                                            : 'Save Member'}
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

export default Members;
