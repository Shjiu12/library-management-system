import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Invalid username or password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5 col-xl-4">

                        <div className="card border-0 shadow-lg rounded-4">
                            <div className="card-body p-4 p-md-5">

                                {/* Logo */}
                                <div className="text-center mb-4">
                                    <div className="bg-primary-subtle text-primary rounded-4 d-inline-flex p-3 mb-3">
                                        <i className="bi bi-book-half fs-1"></i>
                                    </div>

                                    <h3 className="fw-bold">
                                        Library Management
                                    </h3>

                                    <p className="text-secondary">
                                        Sign in to access your library
                                    </p>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="alert alert-danger">
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                {/* Login form */}
                                <form onSubmit={handleSubmit}>

                                    {/* Username */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Username
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-person"></i>
                                            </span>

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter username"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-lock"></i>
                                            </span>

                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Login button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>

                                </form>

                                {/* Register link */}
                                <div className="text-center mt-4">
                                    <span className="text-secondary">
                                        Don't have an account?
                                    </span>

                                    <Link
                                        to="/register"
                                        className="text-decoration-none fw-semibold ms-1"
                                    >
                                        Register
                                    </Link>
                                </div>

                            </div>
                        </div>

                        <p className="text-center text-secondary small mt-4">
                            Library Management System
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;