
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const { user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'bi-speedometer2' },
        { name: 'Books', path: '/books', icon: 'bi-book' },
        { name: 'Book Copies', path: '/book-copies', icon: 'bi-book-half' },
        { name: 'Authors', path: '/authors', icon: 'bi-person-lines-fill' },
        { name: 'Categories', path: '/categories', icon: 'bi-tags' },
        { name: 'Members', path: '/members', icon: 'bi-people' },
        { name: 'Circulation', path: '/circulation', icon: 'bi-arrow-left-right' },
        { name: 'Loan History', path: '/loan-history', icon: 'bi-clock-history' },
        { name: 'Fines', path: '/fines', icon: 'bi-cash-coin' },
        { name: 'Reports', path: '/reports', icon: 'bi-file-earmark-bar-graph' },
    ];

    if (['ADMIN', 'LIBRARIAN'].includes(user?.role)) {
        menuItems.push({
            name: 'Book Requests',
            path: '/book-requests',
            icon: 'bi-bookmark-check'
        });
    }

    return (
        <div className="bg-white border-end min-vh-100 p-3">
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
                <div className="bg-primary-subtle text-primary rounded-3 p-2">
                    <i className="bi bi-book-half fs-4"></i>
                </div>

                <span className="fw-bold text-dark">
                    Library System
                </span>
            </div>

            <nav className="nav nav-pills flex-column gap-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center gap-2 ${
                                isActive ? 'active' : 'text-secondary'
                            }`
                        }
                    >
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
