import axiosInstance from '../axios/axios';

const orderRepository = {
    findPending: async () => {
        return await axiosInstance.get('/orders/pending');
    },
    findHistory: async () => {
        return await axiosInstance.get('/orders/history');
    },
    confirmPendingOrder: async () => {
        return await axiosInstance.get('/orders/pending/confirm'); // PUT → GET
    },
    cancelPendingOrder: async () => {
        return await axiosInstance.get('/orders/pending/cancel'); // PUT → GET
    },
};

export default orderRepository;