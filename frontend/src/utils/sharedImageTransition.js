// Shared-element image transition between a product image somewhere on a page
// (a ProductCard in a grid, a Recently Viewed item, a Shop the Look card) and the
// hero image on ProductDetailsPage - and back again.
//
// Works like a hand-rolled View Transition: the departing page records where its
// image is on screen, and the arriving page flies a temporary fixed-position
// "ghost" <img> from that rectangle to its own image while that image is hidden,
// then reveals it and fades the ghost out. Positions are viewport-based, so it
// doesn't care how far either page is scrolled, and the ghost lives in
// document.body so no ancestor's overflow/stacking context can clip it.
//
// No dependency needed. If anything is missing (no recorded rect, element not
// rendered, reduced motion preferred, stale data) the transition is skipped and
// the page simply renders normally.

import { prefersReducedMotion } from './motion';

// How long a recorded transition stays usable. Generous on purpose: rendering
// the next page can take a while on slow devices, and a stale record can only
// ever match the same product anyway.
const FORWARD_TTL_MS = 4000;
const BACK_TTL_MS = 4000;
const DURATION_MS = 500;
const GHOST_FADE_MS = 180;

// Page -> details: recorded when a product image is clicked.
let forward = null; // { productId, rect, src, fit, background, createdAt }

// Details -> grid: the details page keeps this up to date while it's mounted,
// because by the time the grid renders (browser back included) the details page
// is already on its way out and the browser may have already restored scroll.
let hero = null; // { productId, pageRect, scrollY, src, releasedAt }

// Which section the click came from and where the page was scrolled, so a back
// navigation lands on that same element (the same product can appear in several
// sections of one page) and returns to the same spot, with it on screen.
let origin = null; // { productId, source, scrollY }

const sameId = (a, b) => a != null && b != null && String(a) === String(b);

const toRect = (r) => ({ left: r.left, top: r.top, width: r.width, height: r.height });


// ---- page -> details -------------------------------------------------------

/**
 * Call right before navigating to a product's details page. `element` is the
 * clicked image (or its 3:4 frame); `source` names the section ('grid',
 * 'recent', 'look', ...) so the way back lands in the same place; `fit` /
 * `background` make the flying image start out looking like the clicked one.
 */
export const startProductTransition = (productId, element, src, { source = 'grid', fit = 'cover', background } = {}) => {
    if (!element) return;
    forward = { productId, rect: toRect(element.getBoundingClientRect()), src, fit, background, createdAt: Date.now() };
    origin = { productId, source, scrollY: window.scrollY };
};

export const hasForwardTransition = (productId) =>
    !!forward && sameId(forward.productId, productId) && Date.now() - forward.createdAt < FORWARD_TTL_MS;

export const takeForwardTransition = (productId) => {
    if (!hasForwardTransition(productId)) return null;
    const result = forward;
    forward = null;
    return result;
};

// ---- details -> grid -------------------------------------------------------

export const registerHero = (productId, element, src) => {
    if (!element) return;
    const r = element.getBoundingClientRect();
    hero = {
        productId,
        pageRect: { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height },
        scrollY: window.scrollY,
        src,
        releasedAt: null,
    };
};

// Called on scroll while the details page is mounted. Only the scroll offset is
// tracked (cheap); the browser's own scroll restoration on back navigation
// happens before the grid renders, so this is the last "real" position.
export const updateHeroScroll = (productId) => {
    if (hero && sameId(hero.productId, productId)) hero.scrollY = window.scrollY;
};

export const releaseHero = (productId) => {
    if (hero && sameId(hero.productId, productId)) hero.releasedAt = Date.now();
};

export const hasBackTransition = (productId, source = 'grid') =>
    !!hero && sameId(hero.productId, productId) &&
    !!origin && sameId(origin.productId, productId) && origin.source === source &&
    (hero.releasedAt === null || Date.now() - hero.releasedAt < BACK_TTL_MS);

export const takeBackTransition = (productId, source = 'grid') => {
    if (!hasBackTransition(productId, source)) return null;
    const { pageRect, scrollY, src } = hero;
    hero = null;
    const returnScrollY = origin.scrollY;
    origin = null;
    return {
        rect: { ...pageRect, left: pageRect.left - window.scrollX, top: pageRect.top - scrollY },
        src,
        returnScrollY,
    };
};

// ---- the animation ---------------------------------------------------------

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const applyRect = (el, r) => {
    el.style.left = `${r.left}px`;
    el.style.top = `${r.top}px`;
    el.style.width = `${r.width}px`;
    el.style.height = `${r.height}px`;
};

/**
 * Flies a ghost image from `fromRect` (viewport coords) to wherever
 * `getTargetElement()` currently is. The target is re-measured every frame, so a
 * layout shift or scroll during the flight doesn't make it land in the wrong
 * place. `onDone` is always called exactly once - it's where the caller reveals
 * its real image - even if the animation is skipped or fails.
 */
export const flyImage = ({ fromRect, src, getTargetElement, onDone, fit = 'cover', background = '#f5f1e8' }) => {
    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        onDone();
    };

    try {
        if (!fromRect || !src || prefersReducedMotion() || typeof window.requestAnimationFrame !== 'function') {
            finish();
            return;
        }

        const ghost = document.createElement('img');
        ghost.src = src;
        ghost.alt = '';
        ghost.setAttribute('aria-hidden', 'true');
        Object.assign(ghost.style, {
            position: 'fixed',
            margin: '0',
            objectFit: fit,
            objectPosition: fit === 'contain' ? 'top' : 'center',
            backgroundColor: background,
            pointerEvents: 'none',
            zIndex: '1400',
            opacity: '1',
            transition: `opacity ${GHOST_FADE_MS}ms ease`,
        });
        applyRect(ghost, fromRect);
        document.body.appendChild(ghost);

        const removeGhost = () => {
            ghost.style.opacity = '0';
            setTimeout(() => ghost.remove(), GHOST_FADE_MS + 50);
        };

        const start = performance.now();
        const step = (now) => {
            if (done) return;
            const target = getTargetElement();
            if (!target) {
                finish();
                ghost.remove();
                return;
            }
            const to = target.getBoundingClientRect();
            const t = Math.min(1, (now - start) / DURATION_MS);
            const e = easeInOutCubic(t);
            applyRect(ghost, {
                left: fromRect.left + (to.left - fromRect.left) * e,
                top: fromRect.top + (to.top - fromRect.top) * e,
                width: fromRect.width + (to.width - fromRect.width) * e,
                height: fromRect.height + (to.height - fromRect.height) * e,
            });
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                // Reveal the real image underneath first, then fade the ghost out -
                // this also smooths over the two images not being identical.
                finish();
                requestAnimationFrame(removeGhost);
            }
        };
        requestAnimationFrame(step);

        // Safety net: never leave the real image hidden (e.g. a background tab
        // where rAF is throttled).
        setTimeout(() => {
            if (!done) {
                finish();
                removeGhost();
            }
        }, DURATION_MS + 1000);
    } catch (error) {
        console.error('Shared image transition failed:', error);
        finish();
    }
};
