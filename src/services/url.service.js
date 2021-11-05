import axios from '@/axios'

const getAll = (params) => {
  params['campType'] = 1
  return axios.get('/domains', { params })
}

const deleteById = (id) => {
  return axios.delete(`/domains/${id}`)
}

const save = async (camp, files) => {
  let formData = new FormData()
  let keys = Object.keys(files)
  if (keys) {
    keys.forEach(k => {
      formData.append(k, files[k])
    })
    const { data } = await axios.post('/units/upload', formData)
    Object.assign(camp, data)
  }
  return axios.post('/domains', camp)
}

export default {
  getAll,
  deleteById,
  save
}
