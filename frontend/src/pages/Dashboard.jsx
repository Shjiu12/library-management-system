import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import {useAuth} from '../context/AuthContext';
function Dashboard() {
    const {user} =useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                setError('Unable to load dashboard statistics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-secondary">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
            </div>
        );
    }

    
    const cards = user?.role === 'MEMBER'
        ? [
            {
                title: 'Total Borrowed',
                value: stats.total_borrowed,
                icon: 'bi-book',
                color: 'primary',
            },
            {
                title: 'Active Loans',
                value: stats.active_loans,
                icon: 'bi-clock',
                color: 'success',
            },
            {
                title: 'Overdue Loans',
                value: stats.overdue_loans,
                icon: 'bi-exclamation-circle',
                color: 'danger',
            },
            {
                title: 'Returned Books',
                value: stats.returned_loans,
                icon: 'bi-bookmark-check',
                color: 'info',
            },
            {
                title: 'Total Fines',
                value: `₹${stats.total_fines}`,
                icon: 'bi-cash-coin',
                color: 'warning',
            },
            {
                title: 'Unpaid Fines',
                value: `₹${stats.unpaid_fines}`,
                icon: 'bi-wallet',
                color: 'danger',
            },
        ]
        : [
            {
                title: 'Total Books',
                value: stats.total_books,
                icon: 'bi-book',
                color: 'primary',
            },
            {
                title: 'Total Copies',
                value: stats.total_copies,
                icon: 'bi-collection',
                color: 'success',
            },
            {
                title: 'Available Copies',
                value: stats.available_copies,
                icon: 'bi-bookmark-check',
                color: 'info',
            },
            {
                title: 'Issued Copies',
                value: stats.issued_copies,
                icon: 'bi-arrow-left-right',
                color: 'warning',
            },
            {
                title: 'Total Members',
                value: stats.total_members,
                icon: 'bi-people',
                color: 'primary',
            },
            {
                title: 'Active Loans',
                value: stats.active_loans,
                icon: 'bi-clock',
                color: 'secondary',
            },
            {
                title: 'Overdue Loans',
                value: stats.overdue_loans,
                icon: 'bi-exclamation-circle',
                color: 'danger',
            },
            {
                title: 'Total Fines',
                value: `₹${stats.total_fines}`,
                icon: 'bi-cash-coin',
                color: 'success',
            },
        ];

    return (
        <div>
            {/* Page heading */}
            <div className="mb-4">
                <h3 className="fw-bold">
                    Welcome, {user?.username || 'User'}!
                </h3>
                <p className="text-secondary">
                    {user?.role === 'ADMIN' && 'Administrator Dashboard'}
                    {user?.role === 'LIBRARIAN' && 'Librarian Dashboard'}
                    {user?.role === 'MEMBER' && 'Member Dashboard'}
                            </p>
            </div>

            {/* Statistics cards */}
            <div className="row g-3">
                {cards.map((card, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-secondary mb-2">
                                        {card.title}
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {card.value ?? 0}
                                    </h3>
                                </div>

                                <div
                                    className={`bg-${card.color}-subtle text-${card.color} rounded-3 p-3`}
                                >
                                    <i className={`bi ${card.icon} fs-4`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;