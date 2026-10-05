// Role check used to show admin-only UI. The backend enforces the real
// permissions; this only decides what to display.
export const isAdminUser = () => {
    const role = localStorage.getItem('role');
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
};
