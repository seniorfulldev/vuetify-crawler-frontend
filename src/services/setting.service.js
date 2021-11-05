import axios from '@/axios'

const getSetting = (params) => {
  return axios.get('/setting', { params })
}
const saveSettings = (smerush, majestic) => {
  return axios.post('/setting', { params: { smerush, majestic } })
}

export default {
  getSetting,
  saveSettings
}
