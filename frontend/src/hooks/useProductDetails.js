import { useEffect, useState } from 'react';
import productRepository from '../repository/productRepository';

const useProductDetails = (id) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        productRepository
            .findByIdWithDetails(id)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
                setLoading(false);
            });
    }, [id]);

    return { product, loading };
};

export default useProductDetails;