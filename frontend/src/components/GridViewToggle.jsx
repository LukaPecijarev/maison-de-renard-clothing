import React from 'react';
import { Box, ButtonBase, Tooltip, Typography } from '@mui/material';
import { GRID_VIEW_OPTIONS } from '../hooks/useGridView';

// "View" selector for the shop grids (1 / 2 / 4 products per row). Each option
// is a fine outlined drawing of that many columns; a tan pill glides behind the
// active one, and its icon turns white.

const OPTION_WIDTH = 40;
const OPTION_GAP = 4;
const PADDING = 4;

// Thin outlined columns (like little frames), so it reads as a refined detail.
const ColumnsIcon = ({ count }) => (
    <Box sx={{ display: 'flex', gap: count === 4 ? '2px' : '3px', width: count === 1 ? 10 : 18, height: 14 }}>
        {Array.from({ length: count }).map((_, i) => (
            <Box key={i} sx={{ flex: 1, borderRadius: '2px', border: '1.3px solid currentColor' }} />
        ))}
    </Box>
);

const GridViewToggle = ({ columns, onChange, options = GRID_VIEW_OPTIONS, sx }) => {
    const activeIndex = Math.max(0, options.indexOf(columns));

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, ...sx }}>
            <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                fontSize: '1.05rem', color: '#8b7355', lineHeight: 1,
            }}>
                View
            </Typography>
            <Box
                role="radiogroup"
                aria-label="Products per row"
                sx={{
                    position: 'relative',
                    display: 'flex', gap: `${OPTION_GAP}px`, p: `${PADDING}px`,
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 253, 248, 0.9)',
                    border: '1px solid rgba(212, 184, 150, 0.4)',
                    boxShadow: 'inset 0 1px 3px rgba(139, 115, 85, 0.08), 0 4px 14px rgba(44, 44, 44, 0.04)',
                }}
            >
                {/* Sliding highlight behind the active option */}
                <Box aria-hidden sx={{
                    position: 'absolute', top: PADDING, bottom: PADDING,
                    left: PADDING + activeIndex * (OPTION_WIDTH + OPTION_GAP),
                    width: OPTION_WIDTH,
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #dcc3a3 0%, #c9aa84 100%)',
                    boxShadow: '0 4px 12px rgba(196, 168, 134, 0.45)',
                    transition: 'left 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)',
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }} />

                {options.map((count) => {
                    const active = count === columns;
                    return (
                        <Tooltip key={count} title={`${count} per row`}>
                            <ButtonBase
                                role="radio"
                                aria-checked={active}
                                aria-label={`${count} per row`}
                                onClick={() => onChange(count)}
                                sx={{
                                    position: 'relative', zIndex: 1,
                                    width: OPTION_WIDTH, height: 30, borderRadius: '999px',
                                    color: active ? '#ffffff' : '#b49a7b',
                                    transition: 'color 0.3s ease, transform 0.2s ease',
                                    '&:hover': { color: active ? '#ffffff' : '#6b5640' },
                                    '&:active': { transform: 'scale(0.92)' },
                                    '&.Mui-focusVisible': { outline: '2px solid rgba(212, 184, 150, 0.6)', outlineOffset: 1 },
                                }}
                            >
                                <ColumnsIcon count={count} />
                            </ButtonBase>
                        </Tooltip>
                    );
                })}
            </Box>
        </Box>
    );
};

export default GridViewToggle;
