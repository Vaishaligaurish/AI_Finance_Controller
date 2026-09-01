import apiClient from './apiClient';
export const getExceptions = (runId) => apiClient.get(`/exceptions/${runId}/exceptions`);
export const resolveException = (exceptionId, data) => apiClient.post(`/exceptions/${exceptionId}/resolve`, data);
