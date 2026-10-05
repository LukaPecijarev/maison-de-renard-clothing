import React from 'react';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

// Pill-shaped filter/sort select for the shop: the label sits inside the pill
// ("COLOR | ● Blue"), an active filter gets a soft tan fill, and the menu is a
// rounded cream card with colour swatches and a check on the selected option.
//
// options: [{ value, label, swatch? }] - `swatch` is any CSS background
// (a colour or a gradient). `allLabel` is shown for the empty value.

const Swatch = ({ background, size = 12 }) => (
    <Box component="span" sx={{
        width: size, height: size, borderRadius: '50%', flex: '0 0 auto', display: 'inline-block',
        background, border: '1px solid rgba(44, 44, 44, 0.15)',
    }} />
);

const FilterSelect = ({ label, value, onChange, options, allLabel }) => {
    const selected = options.find((o) => o.value === value);
    const isActive = allLabel !== undefined && value !== '';

    return (
        <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
                PaperProps: {
                    sx: {
                        mt: 1, p: 0.75, minWidth: 200,
                        backgroundColor: '#fffdf8',
                        border: '1px solid rgba(212, 184, 150, 0.35)',
                        borderRadius: '14px',
                        boxShadow: '0 16px 40px rgba(44, 44, 44, 0.14)',
                        '& .MuiMenu-list': { py: 0 },
                        '& .MuiMenuItem-root': {
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
                <MenuItem value="">
                    <Box component="span" sx={{ flex: 1 }}>{allLabel}</Box>
                    {value === '' && <CheckRoundedIcon sx={{ fontSize: 16, color: '#8b7355' }} />}
                </MenuItem>
            )}
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.swatch && <Swatch background={option.swatch} size={14} />}
                    <Box component="span" sx={{ flex: 1 }}>{option.label}</Box>
                    {value === option.value && <CheckRoundedIcon sx={{ fontSize: 16, color: '#8b7355' }} />}
                </MenuItem>
            ))}
        </Select>
    );
};

export default FilterSelect;
