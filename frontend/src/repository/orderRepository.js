import axiosInstance from '../axios/axios';

const orderRepository = {
    findPending: async () => {
        return await axiosInstance.get('/orders/pending');
    },
    findHistory: async () => {
        return await axiosInstance.get('/orders/history');
    },
    confirmPendingOrder: async () => {
        return await axiosInstance.put('/orders/pending/confirm');
    },
    cancelPendingOrder: async () => {
        return await axiosInstance.put('/orders/pending/cancel');
    },
};

export default orderRepository;