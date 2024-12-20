const API_ROOT = "http://localhost:8000";
const API_V1 = "/api/v1";

export const loginURL = `${API_ROOT}${API_V1}/users/create-session`;
export const signupURL = `${API_ROOT}${API_V1}/users/signup`;
export const createJobURL = `${API_ROOT}${API_V1}/users/createjob`;
export const fetchMessageURL = `${API_ROOT}/message/fetchMessages`;
export const fetchListingChatsURL = `${API_ROOT}/message/fetchListingChats`;
export const createMessageURL = `${API_ROOT}/message/createMessage`;
export const aiQuestionsURL = `${API_ROOT}/ai/generateQuestions`;
export const fetchSuggestedPayURL = `${API_ROOT}/ai/fetchSuggestedPay`;
