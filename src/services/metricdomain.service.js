import axios from '@/axios'

const getAll = (params) => {
  return axios.get('/metricdomains', { params })
}

const deleteById = (id) => {
  return axios.delete(`/metricdomains/${id}`)
}

const save = async (camp, files) => {
  let formData = new FormData()
  let keys = Object.keys(files)
  if (keys) {
    keys.forEach(k => {
      formData.append(k, files[k])
    })
    const { data } = await axios.post('/metrics/upload', formData)

    Object.assign(camp, data)
  }
  return axios.post('/metricdomains', camp)
}

export default {
  getAll,
  deleteById,
  save
}
