import api from './axiosInstance'

const unwrap = (response) => {
  const body = response?.data || {}
  return body.data ?? body
}

export const registerUser = (payload) => api.post('/api/auth/registeruser', payload).then(unwrap)
export const loginUser = (payload) => api.post('/api/auth/loginuser', payload).then(unwrap)

export const getProfile = () => api.get('/api/profile/getprofile').then(unwrap)
export const updateProfile = (payload) => api.put('/api/profile/updateprofile', payload).then(unwrap)
export const updateJourney = (payload) => api.put('/api/profile/updatejourney', payload).then(unwrap)

export const getAllCareers = () => api.get('/api/career/getallcareers').then(unwrap)
export const matchCareers = (payload) => api.post('/api/career/matchcareers', payload).then(unwrap)
export const compareCareers = (payload) => api.post('/api/career/comparecareers', payload).then(unwrap)

export const getJourney1Questions = () => api.get('/api/journey1/getjourney1questions').then(unwrap)
export const submitJourney1 = (payload) => api.post('/api/journey1/submitjourney1', payload).then(unwrap)
export const getJourney1Result = (careerId = 'minerva_career_discovery_v4') =>
  api.get(`/api/journey1/GetJourney1Result/${encodeURIComponent(careerId)}`).then(unwrap)

export const getJourney2Careers = () => api.get('/api/journey2/GetJourney2Careers').then(unwrap)
export const getJourney2Questions = (careerId = 'ui_ux') =>
  api.get(`/api/journey2/GetJourney2Questions/${encodeURIComponent(careerId)}`).then(unwrap)
export const submitJourney2 = (payload) => api.post('/api/journey2/SubmitJourney2', payload).then(unwrap)
export const getJourney2Result = (careerId = 'ui_ux') =>
  api.get(`/api/journey2/GetJourney2Result/${encodeURIComponent(careerId)}`).then(unwrap)

export default {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updateJourney,
  getAllCareers,
  matchCareers,
  compareCareers,
  getJourney1Questions,
  submitJourney1,
  getJourney1Result,
  getJourney2Careers,
  getJourney2Questions,
  submitJourney2,
  getJourney2Result,
}