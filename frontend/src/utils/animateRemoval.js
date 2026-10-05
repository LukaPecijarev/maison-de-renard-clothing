// "Slide off to the left" exit for list items (wishlist entries, cart items):
// the item slides out leftwards while fading, then its space collapses so the
// items below glide up, instead of everything jumping. Resolves when finished -
// the caller removes the item from its list after awaiting this.
//
// Uses the Web Animations API. Resolves straight away (no animation) if the user
// prefers reduced motion or the browser can't animate, and never waits longer
// than a safety timeout, so a removal can't get stuck.

import { prefersReducedMotion } from './motion';

const SLIDE_MS = 350;
const COLLAPSE_MS = 250;


const finished = (animation, ms) =>
    Promise.race([
        animation.finished.catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, ms + 300)),
    ]);

// `slide: false` fades the item out in place instead of sliding it left (used
// after the wishlist's fly-to-cart, where the image has already flown away).
const animateRemoval = async (element, { slide = true } = {}) => {
    if (!element || typeof element.animate !== 'function' || prefersReducedMotion()) return;
    try {
        const style = getComputedStyle(element);
        const height = element.offsetHeight;
        const { marginTop, marginBottom } = style;

        element.style.pointerEvents = 'none';
        await finished(element.animate(
            slide
                ? [
                    { transform: 'translateX(0)', opacity: 1 },
                    { transform: 'translateX(-110%)', opacity: 0 },
                ]
                : [
                    { transform: 'scale(1)', opacity: 1 },
                    { transform: 'scale(0.97)', opacity: 0 },
                ],
            { duration: SLIDE_MS, easing: slide ? 'cubic-bezier(0.4, 0, 1, 1)' : 'ease', fill: 'forwards' },
        ), SLIDE_MS);

        element.style.overflow = 'hidden';
        await finished(element.animate(
            [
                { height: `${height}px`, marginTop, marginBottom },
                { height: '0px', marginTop: '0px', marginBottom: '0px' },
            ],
            { duration: COLLAPSE_MS, easing: 'ease', fill: 'forwards' },
        ), COLLAPSE_MS);
    } catch (error) {
        console.error('Removal animation failed:', error);
    }
};

export default animateRemoval;

// Undo animateRemoval (e.g. the server rejected the removal), so the item
// doesn't stay invisible in the list.
export const resetRemoval = (element) => {
    if (!element) return;
    if (typeof element.getAnimations === 'function') element.getAnimations().forEach((a) => a.cancel());
    element.style.pointerEvents = '';
    element.style.overflow = '';
};
