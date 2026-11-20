import api from "./api";
export const getCategories=async()=>{
    const response=await api.get('books/category/');
    return response.data;
};
export const createCategory=async(data)=>{
    const response=await api.post('books/category/',data);
    return response.data;
};
export const updateCategory=async(id,data)=>{
    const response=await api.put(`books/category/${id}/`,data);
    return response.data;
};
export const deleteCategory=async(id)=>{
    const response=await api.delete(`books/category/${id}/`);
    return response.data;
}
// export const getCategory=async(id)=>{
//     const response=await api.get(`books/category/${id}/`);
//     return response.data;
// };