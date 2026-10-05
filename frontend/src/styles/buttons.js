// The site's signature button effect (home page "Shop Now"): a thin border on a
// transparent button; on hover a fill slides in from the left and the button
// lifts slightly. One definition, used everywhere that effect appears.
//
// `isolation: isolate` keeps the sliding fill (z-index -1) inside the button -
// without it, on a button that sits on a coloured card (cart summary, dialogs,
// admin sections), the fill slips behind the card and never shows.

export const fillEffectSx = (borderColor, fillColor, textColor) => ({
    position: 'relative', overflow: 'hidden', isolation: 'isolate',
    backgroundColor: 'transparent',
    border: `1px solid ${borderColor}`,
    color: textColor,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::before': {
        content: '""', position: 'absolute', top: 0, left: '-100%',
        width: '100%', height: '100%', backgroundColor: fillColor,
        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: -1,
    },
    '&:hover': {
        color: textColor, borderColor: fillColor, backgroundColor: 'transparent',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(193, 154, 107, 0.3)',
    },
    '&:hover::before': { left: 0 },
    '&:active': { transform: 'translateY(0)' },
});

// The standard version (Shop Now, Add to cart, Checkout, Continue shopping...).
// Spread it and add only sizing: sx={{ ...fillButtonSx, px: 6, py: 1.5 }}.
export const fillButtonSx = {
    ...fillEffectSx('#e6b8a2', '#f5ebe0', '#22223b'),
    borderRadius: '6px',
    '&.Mui-disabled': { color: 'rgba(34, 34, 59, 0.35)', borderColor: 'rgba(230, 184, 162, 0.4)' },
};
