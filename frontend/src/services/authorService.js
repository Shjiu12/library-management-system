import api from "./api";
export const getAuthors=async()=>{
    const response=await api.get('books/author/');
    return response.data;
};
export const createAuthor=async(authorData)=>{
    const response =await api.post('books/author',data);
    return response.data;
};
export const updateAuthor=async(id, data)=>{
    const response=await api.put(`books/author/${id}`,data);
    return response.data;
};
export const deleteAuthor=async(id)=>{
    const response=await api.delete(`books/author/${id}`);
    return response.data;
};
