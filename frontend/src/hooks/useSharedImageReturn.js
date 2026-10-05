import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { hasBackTransition, takeBackTransition, flyImage } from '../utils/sharedImageTransition';

// Landing side of the shared-element transition (see utils/sharedImageTransition):
// attach `ref` to a product image (or its frame) and apply `hidden` as
// `visibility: hidden`. When the user comes back from that product's details
// page - and left it from this same `source` section - the hero image flies
// back into this element while it stays hidden, then it's revealed.
//
// Checked on every navigation, not just on mount, because some lists stay
// mounted across navigations (e.g. Recently Viewed on the details page itself,
// when going from one product to another and back).
const useSharedImageReturn = (productId, source = 'grid') => {
    const ref = useRef(null);
    const location = useLocation();
    const navigationType = useNavigationType();
    const [hidden, setHidden] = useState(() => hasBackTransition(productId, source));
    const handledKeyRef = useRef(null);

    useLayoutEffect(() => {
        if (handledKeyRef.current === location.key) return; // StrictMode re-runs effects
        handledKeyRef.current = location.key;
        const back = takeBackTransition(productId, source);
        if (!back) {
            setHidden(false);
            return;
        }
        setHidden(true);
        // Return to where the page was scrolled when the image was clicked, so
        // it's on screen to land on - only for real back/forward history
        // navigation, not when arriving here through a fresh link.
        if (navigationType === 'POP' && back.returnScrollY != null) {
            window.scrollTo(0, back.returnScrollY);
        }
        flyImage({
            fromRect: back.rect,
            src: back.src,
            getTargetElement: () => ref.current,
            onDone: () => setHidden(false),
        });
    }, [location.key, productId, source, navigationType]);

    return { ref, hidden };
};

export default useSharedImageReturn;
