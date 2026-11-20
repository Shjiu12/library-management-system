import api from './api';
export const getBookCopies =async()=>{
    const response =await api.get('books/copies/');
    return response.data;
};
export const createBookCopy=async(data)=>{
    const response=await api.post('books/copies/',data);
    return response.data;
};
export const updateBookCopy=async(id ,data)=>{
    const response=await api.put(`books/copies/${id}/`,data);
    return response.data;
}
export const deleteBookCopy=async(id)=>{
    const response=await api.delete(`books/copies/${id}/`);
    return response.data;
};