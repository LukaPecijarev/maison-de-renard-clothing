import { useCallback, useEffect, useState } from 'react';
import categoryRepository from '../repository/categoryRepository';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(() => {
        setLoading(true);
        categoryRepository
            .findAll()
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                setLoading(false);
            });
    }, []);

    const onAdd = useCallback((data) => {
        categoryRepository
            .add(data)
            .then(() => fetchCategories())
            .catch((error) => console.error('Error adding category:', error));
    }, [fetchCategories]);

    const onEdit = useCallback((id, data) => {
        categoryRepository
            .edit(id, data)
            .then(() => fetchCategories())
            .catch((error) => console.error('Error editing category:', error));
    }, [fetchCategories]);

    const onDelete = useCallback((id) => {
        categoryRepository
            .delete(id)
            .then(() => fetchCategories())
            .catch((error) => console.error('Error deleting category:', error));
    }, [fetchCategories]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        onAdd,
        onEdit,
        onDelete,
        fetchCategories,
    };
};

export default useCategories;