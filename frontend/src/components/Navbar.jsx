
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar bg-white border-bottom px-4 py-3">
            <div className="container-fluid">
                {/* Page title */}
                <div>
                    <h5 className="mb-0 fw-bold text-dark">
                        Library Management System
                    </h5>

                    <small className="text-secondary">
                        Manage your library efficiently
                    </small>
                </div>

                {/* User information */}
                <div className="d-flex align-items-center gap-3">
                    <div className="text-end d-none d-sm-block">
                        <div className="fw-semibold text-dark">
                            {user?.username || 'Library User'}
                        </div>

                        <small className="text-secondary">
                            {user?.role || 'User'}
                        </small>
                    </div>

                    {/* User icon */}
                    <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                         style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person fs-5"></i>
                    </div>

                    {/* Logout button */}
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
