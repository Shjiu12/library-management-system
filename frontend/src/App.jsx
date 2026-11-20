import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/MainLayout';
import Books from './pages/Books';
import BookCopies from './pages/BookCopies';
import Authors from './pages/Authors';
import Categories from './pages/Categories';
import Members from './pages/Members';
import Circulation from './pages/Circulation';
import Fines from './pages/Fines';
import LoanHistory from './pages/LoanHistory';
import Reports from './pages/Reports';
import BookRequests from './pages/BookRequests';
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={isAuthenticated ? '/dashboard' : '/login'}
                        replace
                    />
                }
            />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/books' element={<Books />} />
                <Route path='/book-copies' element={<BookCopies />} />
                <Route path='/authors' element={<Authors />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/members' element={<Members />} />
                <Route path='/circulation' element={<Circulation />} />
                <Route path='/fines' element={<Fines />}/>
                <Route path='/loan-history' element={<LoanHistory />} />
                <Route path='/reports' element={<Reports />} />
                <Route path='/book-requests' element={
                    <ProtectedRoute allowedRoles={['ADMIN','LIBRARIAN']}>
                       <BookRequests />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;