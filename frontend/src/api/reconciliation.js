import apiClient from './apiClient';
export const uploadFiles = (formData) => apiClient.post('/reconciliation/upload', formData, { headers: { 'Content-Type': undefined }});
export const startReconciliation = (runId) => apiClient.post(`/reconciliation/${runId}/start`);
export const getRuns = () => apiClient.get('/reconciliation/runs');
export const getRunStatus = (runId) => apiClient.get(`/reconciliation/${runId}/status`);
export const getRunSummary = (runId) => apiClient.get(`/reconciliation/${runId}/summary`);
