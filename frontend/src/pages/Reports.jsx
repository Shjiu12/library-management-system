
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import {
    getDailyReport,
    getMonthlyReport,
    getOverdueReport,
    getFineReport,
    getMostBorrowedReport
} from '../services/reportService';

function Reports() {
    const { user } = useAuth();

    const [daily, setDaily] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [overdue, setOverdue] = useState([]);
    const [fines, setFines] = useState({});
    const [mostBorrowed, setMostBorrowed] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const canViewReports = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    useEffect(() => {
        if (!canViewReports) {
            setLoading(false);
            return;
        }

        const loadReports = async () => {
            try {
                const [
                    dailyData,
                    monthlyData,
                    overdueData,
                    fineData,
                    mostBorrowedData
                ] = await Promise.all([
                    getDailyReport(),
                    getMonthlyReport(),
                    getOverdueReport(),
                    getFineReport(),
                    getMostBorrowedReport()
                ]);

                setDaily(dailyData);
                setMonthly(monthlyData);
                setOverdue(overdueData);
                setFines(fineData);
                setMostBorrowed(mostBorrowedData);
            } catch (err) {
                console.error('Reports loading error:', err);
                setError('Failed to load reports.');
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, [canViewReports]);

    if (!canViewReports) {
        return (
            <div className="alert alert-danger">
                You do not have permission to access reports.
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-5">Loading reports...</div>;
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h2 className="fw-bold">Library Reports</h2>
                <p className="text-muted">
                    View borrowing, overdue, fine and book statistics
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {/* Fine Collection Summary */}
            <h5 className="fw-bold mb-3">Fine Collection Summary</h5>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Total Fines</h6>
                            <h3 className="fw-bold">
                                ₹{Number(fines.total_fines || 0).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Paid Fines</h6>
                            <h3 className="fw-bold text-success">
                                ₹{Number(fines.paid_fines || 0).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Unpaid Fines</h6>
                            <h3 className="fw-bold text-danger">
                                ₹{Number(fines.unpaid_fines || 0).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Borrowing */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Daily Borrowing Report</h5>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Total Borrowed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daily.length > 0 ? daily.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.issue_date}</td>
                                    <td>{item.total}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        No daily records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Monthly Borrowing */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Monthly Borrowing Report</h5>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Month</th>
                                <th>Total Borrowed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthly.length > 0 ? monthly.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {item.month
                                            ? new Date(item.month).toLocaleDateString(
                                                'en-IN',
                                                { month: 'long', year: 'numeric' }
                                            )
                                            : '-'}
                                    </td>
                                    <td>{item.total}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        No monthly records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overdue Books */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Overdue Books Report</h5>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Loan ID</th>
                                <th>Member</th>
                                <th>Book</th>
                                <th>Barcode</th>
                                <th>Due Date</th>
                                <th>Overdue Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdue.length > 0 ? overdue.map(item => (
                                <tr key={item.loan_id}>
                                    <td>{item.loan_id}</td>
                                    <td>{item.member}</td>
                                    <td>{item.book}</td>
                                    <td>{item.barcode}</td>
                                    <td>{item.due_date}</td>
                                    <td>
                                        <span className="badge bg-danger">
                                            {item.overdue_days} days
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No overdue books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Most Borrowed Books */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Top 10 Most Borrowed Books</h5>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Rank</th>
                                <th>Book</th>
                                <th>Total Borrowed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mostBorrowed.length > 0 ? mostBorrowed.map((item, index) => (
                                <tr key={item.copy__book__id}>
                                    <td>{index + 1}</td>
                                    <td>{item.copy__book__title}</td>
                                    <td>{item.total_borrowed}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        No borrowing records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Reports;
