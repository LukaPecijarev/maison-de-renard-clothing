import React, { useEffect, useRef, useState } from 'react';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { prefersReducedMotion } from '../utils/motion';

// Pill-shaped filter/sort select for the shop: the label sits inside the pill
// ("COLOR | ● Blue"), an active filter gets a soft tan fill, and the menu is a
// rounded cream card with colour swatches and a check on the selected option.
//
// options: [{ value, label, swatch? }] - `swatch` is any CSS background
// (a colour or a gradient). `allLabel` is shown for the empty value.
//
// Opening, the options drop in one after another; closing, they leave in
// reverse order before the card fades. The stagger is capped so long lists
// (all the colours) still open quickly.
//
// The page isn't scroll-locked while the menu is open (the lock hides the
// scrollbar, which shifts the page and the fixed chatbot sideways); scrolling
// closes the menu instead, so it never floats away from its pill.

const ITEM_IN_MS = 360;
const ITEM_OUT_MS = 240;
const STAGGER_IN_MS = 55;
const STAGGER_OUT_MS = 35;
const MAX_STAGGER_MS = 440;

const itemIn = keyframes`
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
`;
const itemOut = keyframes`
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-6px); }
`;

const staggerIn = (index) => Math.min(index * STAGGER_IN_MS, MAX_STAGGER_MS);
const staggerOut = (index, count) => Math.min((count - 1 - index) * STAGGER_OUT_MS, MAX_STAGGER_MS / 2);

const Swatch = ({ background, size = 12 }) => (
    <Box component="span" sx={{
        width: size, height: size, borderRadius: '50%', flex: '0 0 auto', display: 'inline-block',
        background, border: '1px solid rgba(44, 44, 44, 0.15)',
    }} />
);

const FilterSelect = ({ label, value, onChange, options, allLabel }) => {
    const selected = options.find((o) => o.value === value);
    const isActive = allLabel !== undefined && value !== '';
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const closeTimer = useRef(null);
    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const itemCount = options.length + (allLabel !== undefined ? 1 : 0);
    // Last item's delay + its animation: the card waits this long before fading.
    const closeMs = staggerOut(0, itemCount) + ITEM_OUT_MS;

    const handleOpen = () => {
        clearTimeout(closeTimer.current);
        setClosing(false);
        setOpen(true);
    };
    const handleClose = () => {
        if (closing) return;
        if (prefersReducedMotion()) { setOpen(false); return; }
        setClosing(true);
        closeTimer.current = setTimeout(() => { setOpen(false); setClosing(false); }, closeMs);
    };
    // Close on page scroll (see the note at the top).
    const closeRef = useRef(handleClose);
    closeRef.current = handleClose;
    useEffect(() => {
        if (!open) return undefined;
        const onScroll = () => closeRef.current();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [open]);

    const itemStyle = (index) => ({
        animationDelay: `${closing ? staggerOut(index, itemCount) : staggerIn(index)}ms`,
    });
    const offset = allLabel !== undefined ? 1 : 0;

    return (
        <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            displayEmpty
            size="small"
            IconComponent={KeyboardArrowDownRoundedIcon}
            renderValue={() => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Typography component="span" sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.62rem', fontWeight: 700,
                        letterSpacing: '0.18em', color: '#a0826d', textTransform: 'uppercase',
                    }}>
                        {label}
                    </Typography>
                    <Box component="span" sx={{ width: '1px', height: 14, backgroundColor: 'rgba(212, 184, 150, 0.6)' }} />
                    {selected?.swatch && <Swatch background={selected.swatch} />}
                    <Typography component="span" noWrap sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.82rem', color: '#2c2c2c' }}>
                        {selected ? selected.label : allLabel}
                    </Typography>
                </Box>
            )}
            MenuProps={{
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                transformOrigin: { vertical: 'top', horizontal: 'left' },
                transitionDuration: { enter: 220, exit: 180 },
                disableScrollLock: true,
                PaperProps: {
                    sx: {
                        mt: 1, p: 0.75, minWidth: 200,
                        backgroundColor: '#fffdf8',
                        border: '1px solid rgba(212, 184, 150, 0.35)',
                        borderRadius: '14px',
                        boxShadow: '0 16px 40px rgba(44, 44, 44, 0.14)',
                        '& .MuiMenu-list': { py: 0 },
                        // Closing: options leave (in reverse) while the card stays put.
                        pointerEvents: closing ? 'none' : undefined,
                        '& .MuiMenuItem-root': {
                            animation: closing
                                ? `${itemOut} ${ITEM_OUT_MS}ms ease-in both`
                                : `${itemIn} ${ITEM_IN_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1) both`,
                            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                            borderRadius: '8px', gap: 1.2, py: 1, px: 1.5,
                            fontFamily: '"Lato", sans-serif', fontSize: '0.84rem', color: '#2c2c2c',
                            transition: 'background-color 0.2s ease',
                            '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.14)' },
                            '&.Mui-selected': { backgroundColor: 'rgba(212, 184, 150, 0.22)' },
                            '&.Mui-selected:hover': { backgroundColor: 'rgba(212, 184, 150, 0.3)' },
                        },
                    },
                },
            }}
            sx={{
                minWidth: 170,
                borderRadius: '999px',
                backgroundColor: isActive ? 'rgba(212, 184, 150, 0.16)' : '#fffdf8',
                boxShadow: '0 2px 10px rgba(44, 44, 44, 0.04)',
                transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isActive ? '#d4b896' : 'rgba(212, 184, 150, 0.45)',
                    transition: 'border-color 0.25s ease',
                },
                '&:hover': { boxShadow: '0 6px 18px rgba(139, 115, 85, 0.12)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d4b896' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#c4a886', borderWidth: '1px' },
                '& .MuiSelect-select': { py: 1.1, pl: 2.2, pr: '40px !important', display: 'flex', alignItems: 'center' },
                '& .MuiSelect-icon': { color: '#8b7355', right: 12, transition: 'transform 0.3s ease' },
            }}
        >
            {allLabel !== undefined && (
                <MenuItem value="" style={itemStyle(0)}>
                    <Box component="span" sx={{ flex: 1 }}>{allLabel}</Box>
                    {value === '' && <CheckRoundedIcon sx={{ fontSize: 16, color: '#8b7355' }} />}
                </MenuItem>
            )}
            {options.map((option, index) => (
                <MenuItem key={option.value} value={option.value} style={itemStyle(index + offset)}>
                    {option.swatch && <Swatch background={option.swatch} size={14} />}
                    <Box component="span" sx={{ flex: 1 }}>{option.label}</Box>
                    {value === option.value && <CheckRoundedIcon sx={{ fontSize: 16, color: '#8b7355' }} />}
                </MenuItem>
            ))}
        </Select>
    );
};

export default FilterSelect;
