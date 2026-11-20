import { useEffect, useState } from 'react';
import {
    getBookRequests,
    reviewBookRequest
} from '../services/bookRequestService';

function BookRequests() {
    const [requests, setRequests] = useState([]);
    const [dueDates, setDueDates] = useState({});
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState('');

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await getBookRequests();
            setRequests(Array.isArray(data) ? data : data.results || []);
            setError('');
        } catch (err) {
            setError('Failed to load book requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleReview = async (requestId, status) => {
        let data = { status };

        if (status === 'APPROVED') {
            const dueDate = dueDates[requestId];

            if (!dueDate) {
                alert('Please select a due date.');
                return;
            }

            data.due_date = dueDate;
        }

        try {
            setProcessingId(requestId);

            const response = await reviewBookRequest(requestId, data);

            alert(response.message || 'Request reviewed successfully.');
            await loadRequests();
        } catch (err) {
            alert(
                err.response?.data?.error ||
                'Failed to review book request.'
            );
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const classes = {
            PENDING: 'bg-warning text-dark',
            APPROVED: 'bg-success',
            REJECTED: 'bg-danger'
        };

        return (
            <span className={`badge ${classes[status] || 'bg-secondary'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return <div className="container mt-4">Loading requests...</div>;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Book Requests</h3>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadRequests}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Member</th>
                                    <th>Book</th>
                                    <th>Requested Date</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No book requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request, index) => (
                                        <tr key={request.id}>
                                            <td>{index + 1}</td>
                                            <td>{request.member_name}</td>
                                            <td>{request.book_title}</td>
                                            <td>
                                                {new Date(request.requested_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {getStatusBadge(request.status)}
                                            </td>

                                            <td>
                                                {request.status === 'PENDING' ? (
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={dueDates[request.id] || ''}
                                                        min={new Date().toLocaleDateString('en-CA')}
                                                        onChange={(e) =>
                                                            setDueDates({
                                                                ...dueDates,
                                                                [request.id]: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td>
                                                {request.status === 'PENDING' && (
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            disabled={processingId === request.id}
                                                            onClick={() =>
                                                                handleReview(request.id, 'APPROVED')
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            disabled={processingId === request.id}
                                                            onClick={() =>
                                                                handleReview(request.id, 'REJECTED')
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookRequests;