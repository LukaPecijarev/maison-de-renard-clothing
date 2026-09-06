import { useEffect, useRef, useState } from 'react';

// Replaces the plain system arrow/hand across the whole site with a small
// arrow glyph glued exactly to the pointer (so there's always a precise,
// visible marker) plus a soft bubble that eases toward it a little behind -
// visible while actively catching up, fading out once it settles on top of
// the arrow, then blooming back in the moment the pointer moves again.
//
// Detection deliberately does NOT read the element's *computed* CSS cursor -
// this component forces `cursor: none !important` globally so the native
// pointer never shows, and that same !important rule would make every
// element's computed cursor report 'none' right back, permanently hiding
// this ring the instant it's added (that was the original bug: it rendered,
// then immediately treated everything as "defer to a local hint" and hid
// itself forever). Instead, "is this interactive / a text field" is decided
// from the DOM shape (tag/role) directly, and the two components that draw
// their own bespoke cursor-follow hint (HomePage/ProductsPage's
// ImageWithHover "VIEW" bubble, RecentlyViewed's "SCROLL" bubble)
// explicitly announce when their hint is showing via a small window event,
// rather than this component trying to infer it after the fact.
//
// Fine-pointer (mouse/trackpad) devices only - touch devices never send a
// mousemove stream to drive this, so it just never renders there.
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], select, summary, [tabindex]:not([tabindex="-1"])';
const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]';
// A classic pointer-arrow glyph (the same silhouette as a standard OS mouse
// cursor) in a 24x24 box, tip at roughly (3,3) - used in place of a plain dot.
const ARROW_PATH = 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [enabled] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
    );

    useEffect(() => {
        if (!enabled) return;

        document.body.classList.add('custom-cursor-active');

        const pos = { x: -100, y: -100 };
        const ring = { x: -100, y: -100 };
        let raf;

        let variant = 'default';

        const loop = () => {
            // Ease the ring toward the raw pointer position each frame rather
            // than snapping straight to it, so it visibly trails behind; the
            // dot stays glued exactly to the pointer for a precise marker.
            ring.x += (pos.x - ring.x) * 0.08;
            ring.y += (pos.y - ring.y) * 0.08;
            // The gap between the dot and the ring doubles as the ring's
            // opacity: wide open (still catching up) while moving, and it
            // fades to nothing once the ring settles back on top of the dot.
            // Set inline rather than via the variant CSS below, since inline
            // styles always win the cascade - the 'hidden' variant (deferring
            // to a local bespoke hint) has to be folded in here too, or its
            // CSS opacity:0 would get overwritten every frame regardless.
            const hidden = variant === 'hidden';
            const gap = Math.hypot(pos.x - ring.x, pos.y - ring.y);
            if (dotRef.current) {
                // Anchored near its tip (not centered) so it sits the way a real
                // pointer arrow does, extending down-right from the cursor
                // position rather than straddling it.
                dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-15%, -15%)`;
                dotRef.current.style.opacity = hidden ? 0 : 1;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
                ringRef.current.style.opacity = hidden ? 0 : Math.min(1, gap / 10);
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        let localHintActive = false;
        const setVariant = (next) => {
            if (variant === next) return;
            variant = next;
            document.body.dataset.cursorVariant = next;
        };

        const onMove = (e) => {
            pos.x = e.clientX;
            pos.y = e.clientY;
            if (localHintActive) return; // a local bespoke hint is already showing - stay hidden
            const target = e.target;
            if (!(target instanceof Element)) return setVariant('default');
            if (target.closest(TEXT_SELECTOR)) setVariant('text');
            else if (target.closest(INTERACTIVE_SELECTOR)) setVariant('interactive');
            else setVariant('default');
        };
        const onLeaveWindow = () => setVariant('hidden');
        const onEnterWindow = () => { if (!localHintActive) setVariant('default'); };
        const onLocalHint = (e) => {
            localHintActive = !!e.detail?.active;
            setVariant(localHintActive ? 'hidden' : 'default');
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('customCursor:localHint', onLocalHint);
        document.documentElement.addEventListener('mouseleave', onLeaveWindow);
        document.documentElement.addEventListener('mouseenter', onEnterWindow);

        return () => {
            document.body.classList.remove('custom-cursor-active');
            delete document.body.dataset.cursorVariant;
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('customCursor:localHint', onLocalHint);
            document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
            document.documentElement.removeEventListener('mouseenter', onEnterWindow);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <svg ref={dotRef} className="custom-cursor-dot" viewBox="0 0 24 24" width="18" height="18">
                <path d={ARROW_PATH} fill="#2c2c2c" stroke="#f5f1e8" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <div ref={ringRef} className="custom-cursor-ring" />
        </>
    );
};

export default CustomCursor;
