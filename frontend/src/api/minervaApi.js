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
export const updateJourney = (payload) => api.post('/api/profile/updatejourney', payload).then(unwrap)

// Career endpoints
export const getAllCareers = () => api.get('/api/career/getallcareers').then(unwrap)
export const matchCareers = (payload) => api.post('/api/career/matchcareers', payload).then(unwrap)
export const compareCareers = (payload) => api.post('/api/career/comparecareers', payload).then(unwrap)

// Journey 1 (I'm Exploring) endpoints
export const getJourney1Questions = () => api.get('/api/journey1/getjourney1questions').then(unwrap)
export const submitJourney1 = (payload) => api.post('/api/journey1/submitJourney1', payload).then((response) => {
  console.log('SubmitJourney1 response.data:', response.data)
  return response.data
})
export const getJourney1Result = (assessmentId) =>
  api.get(`/api/journey1/GetJourney1Result/${encodeURIComponent(assessmentId)}`).then((response) => {
    console.log('GetJourney1Result response.data:', response.data)
    return unwrap(response)
  })

// Journey 2 (Career-in-Mind) endpoints
export const getJourney2Careers = () => api.get('/api/journey2/GetJourney2Careers').then((response) => {
  console.log('Journey2 careers response:', response.data)
  return unwrap(response)
})
export const getJourney2Questions = (careerId) => {
  console.log('Fetching Journey2 questions for careerId:', careerId)
  return api.get(`/api/journey2/GetJourney2Questions/${encodeURIComponent(careerId)}`).then((response) => {
    console.log('Journey2 questions response for', careerId, ':', response.data)
    return unwrap(response)
  }).catch((error) => {
    console.error('Journey2 questions fetch error for', careerId, ':', error)
    throw error
  })
}
export const submitJourney2 = (payload) => api.post('/api/journey2/SubmitJourney2', payload).then((response) => {
  console.log('Journey2 submission response:', response.data)
  return unwrap(response)
})
export const getJourney2Result = (careerId) =>
  api.get(`/api/journey2/GetJourney2Result/${encodeURIComponent(careerId)}`).then((response) => {
    console.log('Journey2 result response:', response.data)
    return unwrap(response)
  })

// Route 3 (Resume/Job Hunting) endpoints
export const startRoute3 = (formData) => api.post('/api/route3/startroute3', formData).then((response) => {
  console.log('Route3 start response:', response.data)
  return unwrap(response)
})
export const submitRoute3 = (payload) => api.post('/api/route3/submitroute3', payload).then((response) => {
  console.log('Route3 submit response:', response.data)
  return unwrap(response)
})
export const getRoute3Result = (attemptId) =>
  api.get(`/api/route3/getroute3result/${encodeURIComponent(attemptId)}`).then((response) => {
    console.log('Route3 result response:', response.data)
    return unwrap(response)
  })

// Roadmap endpoints
export const generateRoadmap = (payload) => api.post('/api/roadmap/generate', payload).then(unwrap)
export const getRoadmapResult = (roadmapId) =>
  api.get(`/api/roadmap/result/${encodeURIComponent(roadmapId)}`).then(unwrap)

// Resume endpoints
export const uploadResume = (formData) => 
  api.post('/api/resume/uploadresume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(unwrap)

// Chat endpoints
export const sendChatMessage = (payload) => 
  api.post('/api/chat/sendchatmessage', payload).then((response) => {
    console.log('Chat response:', response.data)
    return unwrap(response)
  })

export const getChatHistory = (conversationId) =>
  api.get(`/api/chat/getchathistory/${encodeURIComponent(conversationId)}`).then((response) => {
    console.log('Chat history response:', response.data)
    return unwrap(response)
  })

// Mock interview endpoints
export const startInterview = (payload) =>
  api.post('/api/interview/startinterview', payload).then((response) => {
    console.log('Interview start response:', response.data)
    return unwrap(response)
  })

export const submitInterview = (payload) =>
  api.post('/api/interview/submitinterview', payload).then((response) => {
    console.log('Interview submit response:', response.data)
    return unwrap(response)
  })

export const getInterviewResult = (attemptId) =>
  api.get(`/api/interview/getinterviewresult/${encodeURIComponent(attemptId)}`).then((response) => {
    console.log('Interview result response:', response.data)
    return unwrap(response)
  })

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
  // Roadmap
  generateRoadmap,
  getRoadmapResult,
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