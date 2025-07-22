import React, { useEffect, useState, useContext } from 'react';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('User loaded from localStorage:', parsedUser);
            }
        } catch (error) {
            console.error('Error loading user from localStorage:', error);
            localStorage.removeItem('user'); // Xóa dữ liệu lỗi
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user') {
                // Chỉ reload để update state, không redirect về home
                const updatedUser = event.newValue ? JSON.parse(event.newValue) : null;
                setUser(updatedUser);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            console.log('User logged in:', userData);
        } catch (error) {
            console.error('Error saving user to localStorage:', error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
            console.log('User logged out');
        } catch (error) {
            console.error('Error removing user from localStorage:', error);
        }
    };

    const authContextValue = {
        user,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext)
}
