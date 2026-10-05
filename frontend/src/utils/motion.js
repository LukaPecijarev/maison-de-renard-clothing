// True when the user has asked their OS/browser for less motion - every
// animation helper checks this and skips (or simplifies) its animation.
export const prefersReducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
