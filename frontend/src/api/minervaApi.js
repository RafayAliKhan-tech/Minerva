import api from './axiosInstance'

const unwrap = (response) => {
  const body = response?.data || {}
  return body.data ?? body
}

// Auth endpoints
export const registerUser = (payload) => api.post('/api/auth/registeruser', payload).then(unwrap)
export const loginUser = (payload) => api.post('/api/auth/loginuser', payload).then(unwrap)

// Profile endpoints
export const getProfile = () => api.get('/api/profile/getprofile').then(unwrap)
export const updateProfile = (payload) => api.put('/api/profile/updateprofile', payload).then(unwrap)
export const updateJourney = (payload) => api.put('/api/profile/updatejourney', payload).then(unwrap)

// Career endpoints
export const getAllCareers = () => api.get('/api/career/getallcareers').then(unwrap)
export const matchCareers = (payload) => api.post('/api/career/matchcareers', payload).then(unwrap)
export const compareCareers = (payload) => api.post('/api/career/comparecareers', payload).then(unwrap)

// Journey 1 (I'm Exploring) endpoints
export const getJourney1Questions = () => api.get('/api/journey1/getjourney1questions').then(unwrap)
export const submitJourney1 = (payload) => api.post('/api/journey1/submitjourney1', payload).then(unwrap)
export const getJourney1Result = (careerId = 'minerva_career_discovery_v4') =>
  api.get(`/api/journey1/GetJourney1Result/${encodeURIComponent(careerId)}`).then(unwrap)

// Journey 2 (Career-in-Mind) endpoints
export const getJourney2Careers = () => api.get('/api/journey2/GetJourney2Careers').then(unwrap)
export const getJourney2Questions = (careerId = 'ui_ux') =>
  api.get(`/api/journey2/GetJourney2Questions/${encodeURIComponent(careerId)}`).then(unwrap)
export const submitJourney2 = (payload) => api.post('/api/journey2/SubmitJourney2', payload).then(unwrap)
export const getJourney2Result = (careerId = 'ui_ux') =>
  api.get(`/api/journey2/GetJourney2Result/${encodeURIComponent(careerId)}`).then(unwrap)

// Route 3 (Resume/Job Hunting) endpoints
export const startRoute3 = (payload) => api.post('/api/route3/startroute3', payload).then(unwrap)
export const submitRoute3 = (payload) => api.post('/api/route3/submitroute3', payload).then(unwrap)
export const getRoute3Result = (attemptId) =>
  api.get(`/api/route3/getroute3result/${encodeURIComponent(attemptId)}`).then(unwrap)

// Resume endpoints
export const uploadResume = (formData) => 
  api.post('/api/resume/uploadresume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(unwrap)

// Chat endpoints
export const sendChatMessage = (payload) => 
  api.post('/api/chat/sendchatmessage', payload).then(unwrap)

export const getChatHistory = (conversationId) =>
  api.get(`/api/chat/getchathistory/${encodeURIComponent(conversationId)}`).then(unwrap)

// Mock interview endpoints
export const startInterview = (payload) =>
  api.post('/api/interview/startinterview', payload).then(unwrap)

export const submitInterview = (payload) =>
  api.post('/api/interview/submitinterview', payload).then(unwrap)

export const getInterviewResult = (attemptId) =>
  api.get(`/api/interview/getinterviewresult/${encodeURIComponent(attemptId)}`).then(unwrap)

export default {
  // Auth
  registerUser,
  loginUser,
  // Profile
  getProfile,
  updateProfile,
  updateJourney,
  // Career
  getAllCareers,
  matchCareers,
  compareCareers,
  // Journey 1
  getJourney1Questions,
  submitJourney1,
  getJourney1Result,
  // Journey 2
  getJourney2Careers,
  getJourney2Questions,
  submitJourney2,
  getJourney2Result,
  // Route 3
  startRoute3,
  submitRoute3,
  getRoute3Result,
  // Resume
  uploadResume,
  // Chat
  sendChatMessage,
  getChatHistory,
  // Mock interview
  startInterview,
  submitInterview,
  getInterviewResult,
}