import axios from '@/axios'

const getAll = (params) => {
  return axios.get('/keywords/domain', { params })
}

export default {
  getAll
}
