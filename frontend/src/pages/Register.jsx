import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import api from '../services/api'
function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone,setPhone]=useState('');
    const [address,setAddress]=useState('');
    const [error, setError] = useState('');
    const [loading,setLoading] =useState(false);

    const navigate =useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    setLoading(true);

    try {
        const response = await api.post('accounts/register/', {
            username: username,
            email: email,
            password: password,
            phone:'phone',
            address:'address',
        });

        console.log('Registration successful:', response.data);

        alert('Account created successfully! Please login.');

        navigate('/login');

    } catch (err) {
        console.error('Registration error:', err.response?.data);

        const errorData = err.response?.data;

        if (errorData) {
            const messages = Object.entries(errorData)
                .map(([field, errors]) => {
                    const errorMessage = Array.isArray(errors)
                        ? errors.join(', ')
                        : errors;

                    return `${field}: ${errorMessage}`;
                })
                .join('\n');

            setError(messages || 'Registration failed.');
        } else {
            setError('Unable to connect to the server.');
        }
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

                                <div className="text-center mb-4">
                                    <div className="bg-primary-subtle text-primary rounded-4 d-inline-flex p-3 mb-3">
                                        <i className="bi bi-book-half fs-1"></i>
                                    </div>

                                    <h3 className="fw-bold">
                                        Create Account
                                    </h3>

                                    <p className="text-secondary">
                                        Register as a library member
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Username */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Username
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label fw-semibold'>
                                            Phone Number
                                        </label>
                                        <input
                                        type='tel'
                                        className='form-control'
                                        placeholder='Enter Number'
                                        value={phone}
                                        onChange={(e)=>setPhone(e.target.value)}
                                        required
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-control fw-semibold'>
                                            Address
                                        </label>
                                        <input 
                                        type='text'
                                        className='form-control'
                                        placeholder='Enter address'
                                        value={address}
                                        onChange={(e)=>setAddress(e.target.value)}
                                        required
                                        />
                                    </div>

                                
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Create password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Confirm password */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <span className="text-secondary">
                                        Already have an account?
                                    </span>

                                    <Link
                                        to="/login"
                                        className="text-decoration-none fw-semibold ms-1"
                                    >
                                        Login
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;