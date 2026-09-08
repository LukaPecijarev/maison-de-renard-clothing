import { useCallback, useEffect, useState } from 'react';
import categoryRepository from '../repository/categoryRepository';
import apiCache from '../utils/apiCache';

// Categories change even less often than products, so cache them a bit longer.
const CATEGORIES_CACHE_TTL = 5 * 60_000;
const CATEGORIES_CACHE_KEY = 'categories:all';

const useCategories = () => {
    const [categories, setCategories] = useState(() => apiCache.getFresh(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TTL) || []);
    const [loading, setLoading] = useState(() => !apiCache.getFresh(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TTL));

    const fetchCategories = useCallback(() => { // always bypasses the cache - used to refresh after add/edit/delete
        setLoading(true);
        categoryRepository
            .findAll()
            .then((response) => {
                apiCache.set(CATEGORIES_CACHE_KEY, response.data);
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
            .then(() => { apiCache.clear('categories:'); fetchCategories(); })
            .catch((error) => console.error('Error adding category:', error));
    }, [fetchCategories]);

    const onEdit = useCallback((id, data) => {
        categoryRepository
            .edit(id, data)
            .then(() => { apiCache.clear('categories:'); fetchCategories(); })
            .catch((error) => console.error('Error editing category:', error));
    }, [fetchCategories]);

    const onDelete = useCallback((id) => {
        categoryRepository
            .delete(id)
            .then(() => { apiCache.clear('categories:'); fetchCategories(); })
            .catch((error) => console.error('Error deleting category:', error));
    }, [fetchCategories]);

    useEffect(() => {
        const cached = apiCache.getFresh(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TTL);
        if (cached) {
            setCategories(cached);
            setLoading(false);
            return;
        }
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
