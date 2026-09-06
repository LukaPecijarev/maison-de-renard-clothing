import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'wishlist';

const readWishlist = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Mirrors the cartCount pattern already used by Header/useOrder: state lives
// in localStorage, a custom event keeps every mounted consumer in sync.
const useWishlist = () => {
    const [wishlist, setWishlist] = useState(readWishlist);

    useEffect(() => {
        const sync = () => setWishlist(readWishlist());
        window.addEventListener('wishlistUpdated', sync);
        return () => window.removeEventListener('wishlistUpdated', sync);
    }, []);

    const isInWishlist = useCallback(
        (id) => wishlist.some((p) => p.id === id),
        [wishlist]
    );

    const toggleWishlist = useCallback((product) => {
        const current = readWishlist();
        const exists = current.some((p) => p.id === product.id);
        const updated = exists
            ? current.filter((p) => p.id !== product.id)
            : [
                { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl },
                ...current,
            ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('wishlistUpdated'));
        setWishlist(updated);
    }, []);

    const removeFromWishlist = useCallback((id) => {
        const updated = readWishlist().filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('wishlistUpdated'));
        setWishlist(updated);
    }, []);

    return { wishlist, isInWishlist, toggleWishlist, removeFromWishlist };
};

export default useWishlist;
