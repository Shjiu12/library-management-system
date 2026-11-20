
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFines, payFine } from '../services/circulationService';

function Fines() {
    const { user } = useAuth();

    const canManageFines = ['ADMIN', 'LIBRARIAN'].includes(user?.role);

    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadFines = async () => {
        try {
            setLoading(true);
            const data = await getFines();
            setFines(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setError('Failed to load fines.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFines();
    }, []);

    const handlePayment = async (fineId) => {
        try {
            setError('');
            setMessage('');

            await payFine(fineId);

            setMessage('Fine payment recorded successfully.');
            await loadFines();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Failed to record fine payment.'
            );
        }
    };

    const totalFines = fines.reduce(
        (total, fine) => total + Number(fine.amount),
        0
    );

    const unpaidFines = fines
        .filter(fine => !fine.is_paid)
        .reduce((total, fine) => total + Number(fine.amount), 0);

    const paidFines = fines
        .filter(fine => fine.is_paid)
        .reduce((total, fine) => total + Number(fine.amount), 0);

    if (loading) {
        return <div className="text-center mt-5">Loading fines...</div>;
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h2 className="fw-bold">Fines Management</h2>
                <p className="text-muted">View and manage library fines</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Total Fines</h6>
                            <h3 className="fw-bold">₹{totalFines.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Unpaid Fines</h6>
                            <h3 className="fw-bold text-danger">
                                ₹{unpaidFines.toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Paid Fines</h6>
                            <h3 className="fw-bold text-success">
                                ₹{paidFines.toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Fine Records</h5>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Fine ID</th>
                                    <th>Loan ID</th>
                                    <th>Amount</th>
                                    <th>Payment Status</th>
                                    <th>Paid Date</th>
                                    {canManageFines && <th>Action</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {fines.length > 0 ? (
                                    fines.map(fine => (
                                        <tr key={fine.id}>
                                            <td>{fine.id}</td>
                                            <td>{fine.loan}</td>
                                            <td>₹{Number(fine.amount).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${
                                                    fine.is_paid
                                                        ? 'bg-success'
                                                        : 'bg-danger'
                                                }`}>
                                                    {fine.is_paid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>
                                            <td>{fine.paid_at || '-'}</td>

                                            {canManageFines && (
                                                <td>
                                                    {!fine.is_paid && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handlePayment(fine.id)}
                                                        >
                                                            Mark as Paid
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canManageFines ? 6 : 5}
                                            className="text-center text-muted py-4"
                                        >
                                            No fine records found.
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

export default Fines;
