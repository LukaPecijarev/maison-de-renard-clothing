import React from 'react';
import { Dialog, Box, Typography, Button, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// The app's confirmation popup (replaces the browser's plain window.confirm and
// the ad-hoc dialogs): cream card, serif title, thin gold rule, tan "keep" and
// wine "confirm" buttons over a softly blurred backdrop.
const ConfirmDialog = ({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Keep it',
    onConfirm,
    onCancel,
    busy = false,
    icon = <DeleteOutlineIcon sx={{ fontSize: 26, color: '#9c4a4a' }} />,
}) => (
    <Dialog
        open={open}
        onClose={busy ? undefined : onCancel}
        slotProps={{
            paper: {
                sx: {
                    width: 'calc(100% - 32px)', maxWidth: 380, m: 2,
                    borderRadius: '16px',
                    backgroundColor: '#fdfbf5',
                    border: '1px solid rgba(212, 184, 150, 0.35)',
                    boxShadow: '0 24px 60px rgba(44, 44, 44, 0.18)',
                    textAlign: 'center',
                },
            },
            backdrop: {
                sx: { backgroundColor: 'rgba(44, 36, 28, 0.35)', backdropFilter: 'blur(3px)' },
            },
        }}
    >
        <Box sx={{ pt: 4, px: { xs: 3, sm: 4 }, pb: 3 }}>
            <Box sx={{
                width: 52, height: 52, mx: 'auto', mb: 2, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(156, 74, 74, 0.08)',
                border: '1px solid rgba(156, 74, 74, 0.18)',
            }}>
                {icon}
            </Box>
            <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif', fontWeight: 400,
                fontSize: '1.6rem', color: '#2c2c2c', lineHeight: 1.2, mb: 1.5,
            }}>
                {title}
            </Typography>
            <Box sx={{ width: 32, height: '1px', backgroundColor: '#d4b896', mx: 'auto', mb: 1.5 }} />
            {message && (
                <Typography sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: '0.9rem',
                    color: '#6b5640', lineHeight: 1.6,
                }}>
                    {message}
                </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1.5, mt: 3.5 }}>
                <Button
                    fullWidth variant="outlined" onClick={onCancel} disabled={busy}
                    sx={{
                        py: 1.2, borderRadius: '8px', borderColor: 'rgba(212, 184, 150, 0.6)', color: '#8b7355',
                        fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em',
                        '&:hover': { borderColor: '#d4b896', backgroundColor: 'rgba(212, 184, 150, 0.08)' },
                    }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    fullWidth variant="contained" disableElevation onClick={onConfirm} disabled={busy}
                    sx={{
                        py: 1.2, borderRadius: '8px', backgroundColor: '#9c4a4a', color: '#ffffff',
                        fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em',
                        '&:hover': { backgroundColor: '#843d3d' },
                        '&.Mui-disabled': { backgroundColor: 'rgba(156, 74, 74, 0.45)', color: '#ffffff' },
                    }}
                >
                    {busy ? <CircularProgress size={18} sx={{ color: '#ffffff' }} /> : confirmLabel}
                </Button>
            </Box>
        </Box>
    </Dialog>
);

export default ConfirmDialog;
