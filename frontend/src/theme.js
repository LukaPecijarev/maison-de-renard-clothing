import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2c2c2c', // Dark charcoal for text and buttons
        },
        secondary: {
            main: '#8b7355', // Warm brown accent
        },
        background: {
            default: '#f5f1e8', // Warm beige
            paper: '#ffffff',
        },
        text: {
            primary: '#2c2c2c',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
        h1: {
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            letterSpacing: '0.1em',
        },
        h2: {
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            letterSpacing: '0.08em',
        },
        h3: {
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            letterSpacing: '0.05em',
        },
        h6: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontWeight: 400,
        },
        body1: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            lineHeight: 1.8,
        },
        button: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontWeight: 400,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    padding: '12px 32px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                },
            },
        },
    },
});

export default theme;