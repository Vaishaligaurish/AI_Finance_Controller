import apiClient from './apiClient';
export const getTransactions = (runId) => apiClient.get(`/transactions/${runId}/transactions`);
