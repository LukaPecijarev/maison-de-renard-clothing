import { useEffect, useState } from 'react';
import productRepository from '../repository/productRepository';

const useProducts = (categoryId = null) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 useProducts useEffect - categoryId:', categoryId);

        let isMounted = true; // Prevent state update if component unmounts
        setLoading(true);

        const fetchCall = categoryId
            ? productRepository.findByCategoryId(categoryId)
            : productRepository.findAll();

        console.log('📡 Fetching products with categoryId:', categoryId);

        fetchCall
            .then((response) => {
                if (isMounted) {
                    console.log('✅ Response received:', response.data.length, 'products');
                    setProducts(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error('❌ Error fetching products:', error);
                    setProducts([]);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false; // Cleanup function
        };
    }, [categoryId]);

    const fetchProducts = () => {
        setLoading(true);

        const fetchCall = categoryId
            ? productRepository.findByCategoryId(categoryId)
            : productRepository.findAll();

        fetchCall
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
                setLoading(false);
            });
    };

    const onAdd = (data) => {
        productRepository
            .add(data)
            .then(() => fetchProducts())
            .catch((error) => console.error('Error adding product:', error));
    };

    const onEdit = (id, data) => {
        productRepository
            .edit(id, data)
            .then(() => fetchProducts())
            .catch((error) => console.error('Error editing product:', error));
    };

    const onDelete = (id) => {
        productRepository
            .delete(id)
            .then(() => fetchProducts())
            .catch((error) => console.error('Error deleting product:', error));
    };

    const addToCart = (id) => {
        return productRepository
            .addToCart(id)
            .catch((error) => console.error('Error adding to cart:', error));
    };

    const removeFromCart = (id) => {
        return productRepository
            .removeFromCart(id)
            .catch((error) => console.error('Error removing from cart:', error));
    };

    return {
        products,
        loading,
        onAdd,
        onEdit,
        onDelete,
        addToCart,
        removeFromCart,
        fetchProducts,
    };
};

export default useProducts;