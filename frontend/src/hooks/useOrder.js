import { useCallback, useEffect, useState } from 'react';
import orderRepository from '../repository/orderRepository';
import productRepository from '../repository/productRepository';

const useOrder = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return !!token;
    };

    // `silent` refreshes without flipping `loading` - used after add/remove/
    // confirm/cancel, so pages like CartPage don't swap to a full-page spinner
    // (which also cut off the cart's remove animation).
    const fetchPendingOrder = useCallback(({ silent = false } = {}) => {
        if (!isAuthenticated()) {
            setOrder(null);
            localStorage.setItem('cartCount', '0');
            setLoading(false);
            return;
        }

        if (!silent) setLoading(true);
        return orderRepository
            .findPending()
            .then((response) => {
                setOrder(response.data);
                // Зачувај cartCount во localStorage за Header
                const count = response.data?.products?.length || 0;
                localStorage.setItem('cartCount', String(count));
                // Dispatch event за да го слушне Header
                window.dispatchEvent(new Event('cartUpdated'));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order:', error);
                setOrder(null);
                localStorage.setItem('cartCount', '0');
                setLoading(false);
            });
    }, []);

    const addToCart = useCallback(async (productId) => {
        try {
            await productRepository.addToCart(productId);
            await fetchPendingOrder({ silent: true });
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    }, [fetchPendingOrder]);

    const removeFromCart = useCallback(async (productId) => {
        try {
            await productRepository.removeFromCart(productId);
            await fetchPendingOrder({ silent: true });
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return false;
        }
    }, [fetchPendingOrder]);

    const confirmOrder = useCallback(async () => {
        try {
            await orderRepository.confirmPendingOrder();
            localStorage.setItem('cartCount', '0');
            window.dispatchEvent(new Event('cartUpdated'));
            await fetchPendingOrder({ silent: true });
            return true;
        } catch (error) {
            console.error('Error confirming order:', error);
            return false;
        }
    }, [fetchPendingOrder]);

    const cancelOrder = useCallback(async () => {
        try {
            await orderRepository.cancelPendingOrder();
            localStorage.setItem('cartCount', '0');
            window.dispatchEvent(new Event('cartUpdated'));
            await fetchPendingOrder({ silent: true });
            return true;
        } catch (error) {
            console.error('Error cancelling order:', error);
            return false;
        }
    }, [fetchPendingOrder]);

    useEffect(() => {
        fetchPendingOrder();
    }, [fetchPendingOrder]);

    return {
        order,
        loading,
        addToCart,
        removeFromCart,
        confirmOrder,
        cancelOrder,
        fetchPendingOrder,
    };
};

export default useOrder;