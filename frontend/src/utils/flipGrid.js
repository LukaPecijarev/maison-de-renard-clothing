// Smooth re-layout for the shop grids when the VIEW selector changes how many
// products sit in a row: instead of every card jumping to its new size and spot,
// each one glides and grows/shrinks from where it was to where it lands (the
// "FLIP" technique - measure First, change the Layout, Invert, Play).
//
// Usage: `const first = measureGrid(grids)` before the columns change, then
// `playGridFlip(first)` once the new layout is in the DOM (a layout effect).
//
// Uses the Web Animations API. Skips the animation if the user prefers reduced
// motion or the browser can't animate. Only cards on screen (before or after)
// are animated - the rest just take their new place.

import { prefersReducedMotion } from './motion';

const DURATION_MS = 550;
const EASING = 'cubic-bezier(0.25, 0.8, 0.25, 1)';

// The glide each card is currently doing, so a quick second click can stop it
// (after measuring where it is mid-flight) instead of stacking another on top.
const running = new WeakMap();

const onScreen = (rect) => rect.bottom > 0 && rect.top < window.innerHeight;

// Positions of every card (direct child) in the given grid containers.
export const measureGrid = (grids) => {
    const rects = new Map();
    grids.forEach((grid) => {
        if (!grid || !grid.isConnected) return;
        Array.from(grid.children).forEach((card) => rects.set(card, card.getBoundingClientRect()));
    });
    return rects;
};

export const playGridFlip = (first) => {
    if (!first || first.size === 0 || prefersReducedMotion()) return;

    first.forEach((before, card) => {
        if (!card.isConnected || typeof card.animate !== 'function') return;
        running.get(card)?.cancel();
        const after = card.getBoundingClientRect();
        if (!after.width || !(onScreen(before) || onScreen(after))) return;

        // Scale by width only, so the photo keeps its proportions mid-flight.
        const scale = before.width / after.width;
        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(scale - 1) < 0.01) return;

        running.set(card, card.animate(
            [
                { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
                { transformOrigin: 'top left', transform: 'translate(0, 0) scale(1)' },
            ],
            { duration: DURATION_MS, easing: EASING },
        ));
    });
};
