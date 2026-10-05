import React from 'react';
import ProductForm from '../components/ProductForm';
import useProducts from '../hooks/useProducts';

// The form, layout and live preview live in components/ProductForm (shared with
// EditProductPage).
const AddProductPage = () => {
    const { onAdd } = useProducts();
    return <ProductForm mode="add" onSubmit={onAdd} />;
};

export default AddProductPage;
