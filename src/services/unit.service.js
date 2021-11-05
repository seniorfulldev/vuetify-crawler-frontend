import axios from '@/axios'

const getAll = (params) => {
  return axios.get('/units', { params })
}

const getStatus = (params) => {
  return axios.post('/domains/status', { params })
}

const actionStart = (campId) => {
  return axios.post('/units/start', { campId })
}

const startAuto = (campId, stepAuto) => {
  return axios.post('units/auto/', { campId, stepAuto })
}

const stopAuto = (campId) => {
  return axios.post('units/stop/' + campId)
}

const actionSkip = (campId) => {
  return axios.post('/units/skip', { campId })
}

const actionBack = (campId) => {
  return axios.post('/units/back', { campId })
}

const save = async (unit, files) => {
  let formData = new FormData()
  let keys = Object.keys(files)
  if (keys && !unit._id) {
    keys.forEach(k => {
      formData.append(k, files[k])
    })
    const { data } = await axios.post('/units/upload', formData)
    Object.assign(unit, data)
  }

  return axios[unit._id ? 'post' : 'put']('/units', unit)
}

const deleteById = (id) => {
  return axios.delete(`/units/${id}`)
}

const testEmail = async (unit) => {
  return axios.post('/units/email', unit)
}

export default {
  getAll,
  getStatus,
  save,
  startAuto,
  stopAuto,
  actionStart,
  actionSkip,
  actionBack,
  deleteById,
  testEmail
}
