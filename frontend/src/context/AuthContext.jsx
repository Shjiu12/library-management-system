import {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';

import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('access')
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    // Fetch logged-in user details
    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('accounts/me/');

            setUser(response.data);

        } catch (error) {
            console.error('Unable to fetch user:', error);

            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

            setAccessToken(null);
            setUser(null);

        } finally {
            setLoading(false);
        }
    };

    // Check existing login when application loads
    useEffect(() => {
        const token = localStorage.getItem('access');

        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    // Login function
    const login = async (username, password) => {

        const response = await api.post('accounts/login/', {
            username,
            password,
        });

        const { access, refresh } = response.data;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        setAccessToken(access);

        // Fetch actual user details
        const userResponse = await api.get('accounts/me/');

        setUser(userResponse.data);
    };

    // Logout function
    const logout = () => {

        localStorage.removeItem('access');
        localStorage.removeItem('refresh');

        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                setUser,
                login,
                logout,
                loading,
                isAuthenticated: !!accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);