import api from './api';
export const getLoans=async()=>{
    const response=await api.get('circulation/loans/');
    return response.data;
};
// export const getLoan=async(id)=>{
//     const response=await api.get(`circulation/${id}/loan/`);
//     return response.data;
// };
export const issueBook=async(data)=>{
    const response=await api.post('circulation/issue/',data);
    return response.data;
};
export const returnBook=async(loanId)=>{
    const response=await api.post('circulation/return/',{
        loan_id:loanId
    });
    return response.data;
};
export const getFines=async()=>{
    const response=await api.get('circulation/fines/');
    return response.data;
};
export const payFine=async(fineId)=>{
    const response=await api.patch(`circulation/fines/${fineId}/pay/`);
    return response.data;
};
