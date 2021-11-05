import axios from '@/axios'

const getAll = (params) => {
  return axios.get('/keywords', { params })
}

const save = async (unit, files) => {
  let formData = new FormData()
  let keys = Object.keys(files)
  if (keys) {
    keys.forEach(k => {
      formData.append(k, files[k])
    })
    const { data } = await axios.post('/keywords/upload', formData)
    Object.assign(unit, data)
  }

  return axios.put('/keywords', unit)
}

const startAuto = (keyId) => {
  return axios.post('/keywords/start', { keyId })
}

const stopAuto = (keyId) => {
  return axios.post('keywords/stop', { keyId })
}

const deleteById = (id) => {
  return axios.delete(`/keywords/${id}`)
}

export default {
  getAll,
  save,
  startAuto,
  stopAuto,
  deleteById
}
