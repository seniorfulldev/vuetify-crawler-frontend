import axios from '@/axios'

const getDashboardStats = (params) => {
  return axios.post('/reports', { params })
}

const getUserData = () => {
  return axios.get('/auth/user')
}

export default {
  getDashboardStats,
  getUserData
}
