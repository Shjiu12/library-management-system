
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getLoans,
    issueBook,
    returnBook
} from '../services/circulationService';
import { getMembers } from '../services/memberService';
import { getBookCopies } from '../services/bookCopyService';

function Circulation() {
    const { user } = useAuth();

    const canManageCirculation = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    const [loans, setLoans] = useState([]);
    const [members, setMembers] = useState([]);
    const [copies, setCopies] = useState([]);

    const [formData, setFormData] = useState({
        member_id: '',
        copy_id: '',
        due_date: ''
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);

            const loanData = await getLoans();
            setLoans(Array.isArray(loanData) ? loanData : loanData.results || []);

            if (canManageCirculation) {
                const [memberData, copyData] = await Promise.all([
                    getMembers(),
                    getBookCopies()
                ]);

                setMembers(
                    Array.isArray(memberData) ? memberData : memberData.results || []
                );

                const copyList = Array.isArray(copyData)
                    ? copyData
                    : copyData.results || [];

                setCopies(copyList.filter(copy => copy.status === 'AVAILABLE'));
            }
        } catch (err) {
            setError('Failed to load circulation data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await issueBook({
                member_id: Number(formData.member_id),
                copy_id: Number(formData.copy_id),
                due_date: formData.due_date
            });

            setMessage('Book issued successfully.');

            setFormData({
                member_id: '',
                copy_id: '',
                due_date: ''
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Failed to issue book. Please check the selected details.'
            );
        }
    };

    const handleReturn = async (loanId) => {
        setError('');
        setMessage('');

        try {
            const result = await returnBook(loanId);

            setMessage(
                result.fine_amount
                    ? `Book returned. Fine amount: ₹${result.fine_amount}`
                    : 'Book returned successfully.'
            );

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Failed to return book.'
            );
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading circulation...</div>;
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Circulation Management</h2>
                    <p className="text-muted mb-0">
                        Manage book issuing and returning
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {message && (
                <div className="alert alert-success">{message}</div>
            )}

            {canManageCirculation && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0">Issue a Book</h5>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleIssue}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Member</label>
                                    <select
                                        className="form-select"
                                        name="member_id"
                                        value={formData.member_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Member</option>
                                        {members.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Available Book Copy</label>
                                    <select
                                        className="form-select"
                                        name="copy_id"
                                        value={formData.copy_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Book Copy</option>
                                        {copies.map(copy => (
                                            <option key={copy.id} value={copy.id}>
                                                {copy.book_title} - {copy.barcode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="due_date"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="col-md-1 d-flex align-items-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Issue
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Loan History</h5>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    {canManageCirculation && <th>Member</th>}
                                    <th>Book</th>
                                    <th>Barcode</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Returned Date</th>
                                    <th>Status</th>
                                    {canManageCirculation && <th>Action</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {loans.length > 0 ? (
                                    loans.map(loan => (
                                        <tr key={loan.id}>
                                            <td>{loan.id}</td>

                                            {canManageCirculation && (
                                                <td>{loan.member_name}</td>
                                            )}

                                            <td>{loan.book_title}</td>
                                            <td>{loan.barcode}</td>
                                            <td>{loan.issue_date}</td>
                                            <td>{loan.due_date}</td>
                                            <td>{loan.returned_at || '-'}</td>

                                            <td>
                                                <span className={`badge ${
                                                    loan.status === 'ACTIVE'
                                                        ? 'bg-primary'
                                                        : loan.status === 'OVERDUE'
                                                        ? 'bg-danger'
                                                        : 'bg-success'
                                                }`}>
                                                    {loan.status}
                                                </span>
                                            </td>

                                            {canManageCirculation && (
                                                <td>
                                                    {loan.status === 'ACTIVE' && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleReturn(loan.id)}
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canManageCirculation ? 9 : 7}
                                            className="text-center text-muted py-4"
                                        >
                                            No loan records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Circulation;
