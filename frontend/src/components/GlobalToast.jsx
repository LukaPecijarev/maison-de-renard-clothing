import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { subscribeToToasts } from '../utils/toast';

// App-wide notification (see utils/toast.js), styled like the rest of the shop:
// a cream card near the top of the screen with a round icon, a serif headline and
// a short line, gliding down in and fading back up out. Replaces window.alert().
const VARIANTS = {
    success: { color: '#2e7d32', tint: 'rgba(46, 125, 50, 0.1)', Icon: CheckRoundedIcon },
    error: { color: '#9c4a4a', tint: 'rgba(156, 74, 74, 0.1)', Icon: PriorityHighRoundedIcon },
};
const EXIT_MS = 350;

const GlobalToast = () => {
    const [toast, setToast] = useState(null);
    const [leaving, setLeaving] = useState(false);
    const timers = useRef([]);

    const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

    const dismiss = () => {
        clearTimers();
        setLeaving(true);
        timers.current.push(setTimeout(() => setToast(null), EXIT_MS));
    };

    useEffect(() => subscribeToToasts((next) => {
        clearTimers();
        setLeaving(false);
        setToast(next);
        timers.current.push(setTimeout(dismiss, next.duration));
    }), []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => clearTimers, []);

    if (!toast) return null;
    const { color, tint, Icon } = VARIANTS[toast.variant] || VARIANTS.success;

    return (
        <Box
            role="status"
            aria-live="polite"
            sx={{
                position: 'fixed', top: { xs: 16, sm: 28 }, left: '50%', zIndex: 1500,
                width: 'calc(100% - 32px)', maxWidth: 420,
                transform: 'translateX(-50%)',
                animation: leaving
                    ? `toastOut ${EXIT_MS}ms ease forwards`
                    : 'toastIn 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '@keyframes toastIn': {
                    '0%': { opacity: 0, transform: 'translate(-50%, -16px) scale(0.97)' },
                    '100%': { opacity: 1, transform: 'translate(-50%, 0) scale(1)' },
                },
                '@keyframes toastOut': {
                    '0%': { opacity: 1, transform: 'translate(-50%, 0)' },
                    '100%': { opacity: 0, transform: 'translate(-50%, -12px)' },
                },
            }}
        >
            <Box sx={{
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: 2,
                pl: 2.5, pr: 1.5, py: 2,
                backgroundColor: 'rgba(253, 251, 245, 0.96)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 184, 150, 0.4)', borderRadius: '16px',
                boxShadow: '0 18px 50px rgba(44, 44, 44, 0.16)',
            }}>
                <Box sx={{
                    flex: '0 0 auto', width: 42, height: 42, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: tint, border: `1.5px solid ${color}`, color,
                }}>
                    <Icon sx={{ fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#2c2c2c', lineHeight: 1.2 }}>
                        {toast.title}
                    </Typography>
                    {toast.message && (
                        <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#6b5640', mt: 0.3 }}>
                            {toast.message}
                        </Typography>
                    )}
                </Box>
                <IconButton size="small" aria-label="Dismiss" onClick={dismiss} sx={{ color: '#a0826d', alignSelf: 'flex-start' }}>
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
                {/* Thin bar that empties as the toast's time runs out */}
                <Box sx={{
                    position: 'absolute', left: 0, bottom: 0, height: '2px', width: '100%',
                    backgroundColor: color, opacity: 0.5, transformOrigin: 'left',
                    animation: `toastTimer ${toast.duration}ms linear forwards`,
                    '@keyframes toastTimer': { '0%': { transform: 'scaleX(1)' }, '100%': { transform: 'scaleX(0)' } },
                }} key={toast.id} />
            </Box>
        </Box>
    );
};

export default GlobalToast;
