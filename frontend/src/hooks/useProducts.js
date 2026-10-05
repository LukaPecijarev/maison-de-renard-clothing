import { useEffect, useState } from 'react';
import productRepository from '../repository/productRepository';
import apiCache from '../utils/apiCache';

// Cache the catalog for a minute - long enough that clicking around the site
// (Products -> a product -> back) doesn't re-fetch it every time, short enough
// that stock/price edits made elsewhere still show up quickly.
const PRODUCTS_CACHE_TTL = 60_000;
const cacheKeyFor = (categoryId) => (categoryId ? `products:category:${categoryId}` : 'products:all');

const useProducts = (categoryId = null) => {
    const [products, setProducts] = useState(() => apiCache.getFresh(cacheKeyFor(categoryId), PRODUCTS_CACHE_TTL) || []);
    const [loading, setLoading] = useState(() => !apiCache.getFresh(cacheKeyFor(categoryId), PRODUCTS_CACHE_TTL));

    useEffect(() => {
        let isMounted = true; // Prevent state update if component unmounts

        const cached = apiCache.getFresh(cacheKeyFor(categoryId), PRODUCTS_CACHE_TTL);
        if (cached) {
            setProducts(cached);
            setLoading(false);
            return () => { isMounted = false; };
        }

        setLoading(true);
        const fetchCall = categoryId
            ? productRepository.findByCategoryId(categoryId)
            : productRepository.findAll();

        fetchCall
            .then((response) => {
                apiCache.set(cacheKeyFor(categoryId), response.data);
                if (isMounted) {
                    setProducts(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error('Error fetching products:', error);
                    setProducts([]);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false; // Cleanup function
        };
    }, [categoryId]);

    const fetchProducts = () => { // i call this when i want to refresh after add/del/edit functions - always bypasses the cache
        setLoading(true);

        const fetchCall = categoryId
            ? productRepository.findByCategoryId(categoryId)
            : productRepository.findAll();

        fetchCall
            .then((response) => {
                apiCache.set(cacheKeyFor(categoryId), response.data);
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
                setLoading(false);
            });
    };

    // Like onDelete below: return the request and re-throw on failure, so the
    // Add/Edit pages can tell success from failure (they used to always report
    // success).
    const onAdd = (data) => {
        return productRepository
            .add(data)
            .then(() => { apiCache.clear('products:'); fetchProducts(); })
            .catch((error) => {
                console.error('Error adding product:', error);
                throw error;
            });
    };

    const onEdit = (id, data) => {
        return productRepository
            .edit(id, data)
            .then(() => { apiCache.clear('products:'); fetchProducts(); })
            .catch((error) => {
                console.error('Error editing product:', error);
                throw error;
            });
    };

    // Returns the request and re-throws on failure - it used to swallow the
    // error, so the page announced "deleted successfully" even when the server
    // had refused and the product was still in the database.
    const onDelete = (id) => {
        return productRepository
            .delete(id)
            .then(() => { apiCache.clear('products:'); fetchProducts(); })
            .catch((error) => {
                console.error('Error deleting product:', error);
                throw error;
            });
    };

    const addToCart = (id) => {
        return productRepository
            .addToCart(id)
            .then((response) => { apiCache.clear('products:'); return response; })
            .catch((error) => console.error('Error adding to cart:', error));
    };

    const removeFromCart = (id) => {
        return productRepository
            .removeFromCart(id)
            .then((response) => { apiCache.clear('products:'); return response; })
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
