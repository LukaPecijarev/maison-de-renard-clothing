import React from 'react';
import { Snackbar, Alert } from '@mui/material';

// The bottom-right status message used across the shop (added to cart, saved,
// failed...). `snackbar` is { open, message, severity }; `onClose` hides it.
const AppSnackbar = ({ snackbar, onClose, duration = 3000 }) => (
    <Snackbar
        open={snackbar.open}
        autoHideDuration={duration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        <Alert
            onClose={onClose}
            severity={snackbar.severity}
            sx={{
                width: '100%', borderRadius: '12px', alignItems: 'center',
                fontFamily: '"Lato", sans-serif', fontSize: '0.88rem',
                boxShadow: '0 10px 30px rgba(44, 44, 44, 0.14)',
            }}
        >
            {snackbar.message}
        </Alert>
    </Snackbar>
);

export default AppSnackbar;
