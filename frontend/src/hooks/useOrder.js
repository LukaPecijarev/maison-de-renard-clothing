import { useCallback, useEffect, useState } from 'react';
import orderRepository from '../repository/orderRepository';
import productRepository from '../repository/productRepository';

const useOrder = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check authentication directly without using useAuth hook
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return !!token;
    };

    console.log('🛒 CartPage - order:', order);
    console.log('🛒 CartPage - loading:', loading);
    console.log('🛒 CartPage - cartItems:', order?.products);

    const fetchPendingOrder = useCallback(() => {
        if (!isAuthenticated()) {
            setOrder(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        orderRepository
            .findPending()
            .then((response) => {
                console.log('📦 Cart data:', response.data);
                setOrder(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order:', error);
                setOrder(null);
                setLoading(false);
            });
    }, []);

    const addToCart = useCallback(async (productId) => {
        try {
            console.log('➕ Adding product to cart:', productId);
            await productRepository.addToCart(productId);
            await fetchPendingOrder(); // Refresh cart
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    }, [fetchPendingOrder]);

    const removeFromCart = useCallback(async (productId) => {
        try {
            console.log('➖ Removing product from cart:', productId);
            await productRepository.removeFromCart(productId);
            await fetchPendingOrder(); // Refresh cart
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return false;
        }
    }, [fetchPendingOrder]);

    const confirmOrder = useCallback(() => {
        orderRepository
            .confirmPendingOrder()
            .then(() => {
                fetchPendingOrder();
            })
            .catch((error) => console.error('Error confirming order:', error));
    }, [fetchPendingOrder]);

    const cancelOrder = useCallback(() => {
        orderRepository
            .cancelPendingOrder()
            .then(() => {
                fetchPendingOrder();
            })
            .catch((error) => console.error('Error cancelling order:', error));
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