import api from './api';
export const getBookRequests=async()=>{
    const response=await api.get('circulation/requests/');
    return response.data;
};
export const createBookRequest=async(bookId)=>{
    const response=await api.post('circulation/requests/',{
        book:bookId
    });
    return response.data;
};
export const reviewBookRequest=async(requestId,data)=>{
    const response=await api.patch(
        `circulation/requests/${requestId}/review/`,data
    );
    return response.data;
};