import { useState, useEffect } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in by looking for JWT token
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role'); // ✅ Load role

        if (token && username) {
            setUser({ username, token, role });
        }
    }, []);

    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return !!token;
    };

    // Reads straight from localStorage (like isAuthenticated) rather than
    // the `user` state above, which is only populated once on this hook
    // instance's mount - components that call login() through a *different*
    // useAuth() instance (e.g. LoginPage) won't have updated it.
    const getUsername = () => localStorage.getItem('username');

    const login = (token, username, role) => { // ✅ Add role parameter
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role); // ✅ Save role!
        setUser({ username, token, role });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role'); // ✅ Clear role on logout
        setUser(null);
    };

    return {
        user,
        isAuthenticated,
        getUsername,
        login,
        logout,
    };
};

export default useAuth;