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
        login,
        logout,
    };
};

export default useAuth;