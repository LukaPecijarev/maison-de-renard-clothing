// Tiny app-wide notification bus. Any page calls showToast(...) and the single
// <GlobalToast /> mounted in App.js displays it - outside the routes, so a toast
// survives navigation (e.g. "Order confirmed" while checkout moves to the home page).

const listeners = new Set();

/** variant: 'success' | 'error'; title: short serif headline; message: optional line below. */
export const showToast = ({ variant = 'success', title, message, duration = 4000 }) => {
    const toast = { id: Date.now() + Math.random(), variant, title, message, duration };
    listeners.forEach((listener) => listener(toast));
};

export const subscribeToToasts = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
