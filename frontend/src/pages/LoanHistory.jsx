
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLoans } from '../services/circulationService';

function LoanHistory() {
    const { user } = useAuth();

    const [loans, setLoans] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const canViewAll = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    useEffect(() => {
        const loadLoans = async () => {
            try {
                const data = await getLoans();
                setLoans(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error('Loan history error:',err);
                setError('Failed to load loan history.');
            } finally {
                setLoading(false);
            }
        };

        loadLoans();
    }, []);

    const filteredLoans = loans.filter(loan => {
        const matchesSearch =
            loan.book_title?.toLowerCase().includes(search.toLowerCase()) ||
            loan.barcode?.toLowerCase().includes(search.toLowerCase()) ||
            loan.member_name?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'ALL' || loan.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="text-center mt-5">Loading loan history...</div>;
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h2 className="fw-bold">Loan History</h2>
                <p className="text-muted">
                    View and search book borrowing records
                </p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search book, barcode or member..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="OVERDUE">Overdue</option>
                                <option value="RETURNED">Returned</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Loan ID</th>
                                    {canViewAll && <th>Member</th>}
                                    <th>Book</th>
                                    <th>Barcode</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Returned Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLoans.length > 0 ? (
                                    filteredLoans.map(loan => (
                                        <tr key={loan.id}>
                                            <td>{loan.id}</td>

                                            {canViewAll && (
                                                <td>{loan.member_name}</td>
                                            )}

                                            <td>{loan.book_title}</td>
                                            <td>{loan.barcode}</td>
                                            <td>{loan.issue_date}</td>
                                            <td>{loan.due_date}</td>
                                            <td>{loan.returned_at || '-'}</td>

                                            <td>
                                                <span className={`badge ${
                                                    loan.status === 'RETURNED'
                                                        ? 'bg-success'
                                                        : loan.status === 'OVERDUE'
                                                        ? 'bg-danger'
                                                        : 'bg-primary'
                                                }`}>
                                                    {loan.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canViewAll ? 8 : 7}
                                            className="text-center text-muted py-4"
                                        >
                                            No loan records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-muted small">
                        Showing {filteredLoans.length} of {loans.length} records
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanHistory;
