import axiosInstance from '../axios/axios';

const productRepository = {
    findAll: async () => {
        return await axiosInstance.get('/products');
    },
    findById: async (id) => {
        return await axiosInstance.get(`/products/${id}`);
    },
    findByIdWithDetails: async (id) => {
        return await axiosInstance.get(`/products/${id}/details`);
    },
    findByCategoryId: async (categoryId) => {
        return await axiosInstance.get(`/products/category/${categoryId}`);
    },
    add: async (data) => {
        return await axiosInstance.post('/products/add', data);
    },
    edit: async (id, data) => {
        return await axiosInstance.put(`/products/${id}/edit`, data);
    },
    delete: async (id) => {
        return await axiosInstance.delete(`/products/${id}/delete`);
    },
    addToCart: async (id) => {
        return await axiosInstance.post(`/products/${id}/add-to-cart`);
    },
    removeFromCart: async (id) => {
        return await axiosInstance.post(`/products/${id}/remove-from-cart`);
    },
};

export default productRepository;