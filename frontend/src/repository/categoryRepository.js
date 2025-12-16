import axiosInstance from '../axios/axios';

const categoryRepository = {
    findAll: async () => {
        return await axiosInstance.get('/categories');
    },
    findById: async (id) => {
        return await axiosInstance.get(`/categories/${id}`);
    },
    add: async (data) => {
        return await axiosInstance.post('/categories/add',data);
    },
    edit: async (id,data) => {
        return await axiosInstance.put(`/categories/${id}/edit`,data);
    },
    delete: async (id) => {
        return await axiosInstance.delete(`/categories/${id}/delete`);
    },
};

export default categoryRepository;