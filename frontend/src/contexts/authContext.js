import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (token && username && role) {
            setUser({ token, username, role });
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (token, username, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        setUser({ token, username, role });
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setUser(null);
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    // Check if user is customer
    const isCustomer = () => {
        return user?.role === 'CUSTOMER';
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null;
    };

    const value = {
        user,
        login,
        logout,
        isAdmin,
        isCustomer,
        isAuthenticated,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};