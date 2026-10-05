// Opening animation for form pages (Add/Edit Product): content fades in and
// slides up slightly instead of appearing all at once. `both` keeps a delayed
// element hidden until its turn. Skipped for users who prefer reduced motion.
export const pageEnterSx = {
    animation: 'pageEnter 0.55s cubic-bezier(0.25, 0.8, 0.25, 1) both',
    '@keyframes pageEnter': {
        '0%': { opacity: 0, transform: 'translateY(18px)' },
        '100%': { opacity: 1, transform: 'none' },
    },
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
};

export const pageEnterDelayedSx = (delaySeconds) => ({ ...pageEnterSx, animationDelay: `${delaySeconds}s` });
