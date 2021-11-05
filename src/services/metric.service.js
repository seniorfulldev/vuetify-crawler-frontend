import axios from '@/axios'

const getAll = (params) => {
  return axios.get('/metrics', { params })
}
const updateMajestic = (campId) => {
  return axios.post('/metrics/updateMajestic', { campId })
}
const updateSEMrush = (campId) => {
  return axios.post('/metrics/updateSEMrush', { campId })
}
const save = async (unit, files) => {
  let formData = new FormData()
  let keys = Object.keys(files)
  if (keys && !unit._id) {
    keys.forEach(k => {
      formData.append(k, files[k])
    })
    const { data } = await axios.post('/metrics/upload', formData)
    Object.assign(unit, data)
  }

  return axios[unit._id ? 'post' : 'put']('/metrics', unit)
}

const deleteById = (id) => {
  return axios.delete(`/metrics/${id}`)
}

export default {
  getAll,
  save,
  updateMajestic,
  updateSEMrush,
  deleteById
}
