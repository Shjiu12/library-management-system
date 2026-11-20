import api from './api';
export const getDailyReport=async()=>{
    const response=await api.get('reports/daily/');
    return response.data;
};
export const getMonthlyReport=async()=>{
    const response=await api.get('reports/monthly/');
    return response.data;
};
export const getOverdueReport=async()=>{
    const response=await api.get('reports/overdue/');
    return response.data;
};
export const getFineReport=async()=>{
    const response=await api.get('reports/fines/');
    return response.data;
};
export const getMostBorrowedReport=async()=>{
    const response=await api.get('reports/most-borrowed/');
    return response.data;
};