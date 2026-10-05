// "Added to cart" animation: a copy of the product image flies from where it is
// to the navbar cart icon (marked with data-cart-icon in Header.jsx), arcing up
// slightly while it shrinks and fades out, then the icon gives a small bump as it
// "lands". Purely decorative - the item is already in the cart when this runs.
//
// Uses the Web Animations API on a fixed-position copy in document.body, so no
// container can clip it. Skipped (does nothing) if the user prefers reduced
// motion, the browser can't animate, or there's no visible cart icon.
//
// Returns a promise that resolves once it has landed (or straight away if it
// was skipped), so callers can follow up - e.g. the wishlist removes the item.

import { prefersReducedMotion } from './motion';

const FLY_MS = 750;


const findCartIcon = () =>
    [...document.querySelectorAll('[data-cart-icon]')].find((el) => el.getClientRects().length > 0) || null;

const flyToCart = (imageElement, src) => new Promise((resolve) => {
    try {
        const cart = findCartIcon();
        if (!imageElement || !src || !cart || typeof imageElement.animate !== 'function' || prefersReducedMotion()) {
            resolve();
            return;
        }

        const from = imageElement.getBoundingClientRect();
        const to = cart.getBoundingClientRect();
        if (from.width === 0 || from.height === 0) {
            resolve();
            return;
        }

        const ghost = document.createElement('img');
        ghost.src = src;
        ghost.alt = '';
        ghost.setAttribute('aria-hidden', 'true');
        Object.assign(ghost.style, {
            position: 'fixed',
            left: `${from.left}px`,
            top: `${from.top}px`,
            width: `${from.width}px`,
            height: `${from.height}px`,
            objectFit: 'cover',
            margin: '0',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(44, 44, 44, 0.2)',
            pointerEvents: 'none',
            zIndex: '1400',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
        });
        document.body.appendChild(ghost);

        // Move the image's centre onto the icon's centre, shrinking it to
        // roughly icon size, with a lift at the midpoint so it travels in an arc.
        const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
        const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
        const endScale = Math.max(0.06, Math.min(0.2, 28 / from.width));
        const lift = Math.min(120, Math.abs(dy) * 0.25 + 40);

        const flight = ghost.animate(
            [
                { transform: 'translate(0, 0) scale(1)', opacity: 1, borderRadius: '4px' },
                { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - lift}px) scale(${(1 + endScale) / 2})`, opacity: 0.85, offset: 0.5 },
                { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, opacity: 0, borderRadius: '50%' },
            ],
            { duration: FLY_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
        );

        let landed = false;
        const land = () => {
            if (landed) return;
            landed = true;
            ghost.remove();
            resolve();
            if (typeof cart.animate === 'function') {
                cart.animate(
                    [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
                    { duration: 350, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
                );
            }
        };
        flight.finished.then(land, land);
        // Safety net (e.g. a background tab where animations are paused).
        setTimeout(land, FLY_MS + 1000);
    } catch (error) {
        console.error('Fly-to-cart animation failed:', error);
        resolve();
    }
});

export default flyToCart;
