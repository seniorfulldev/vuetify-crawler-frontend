import axios from '@/axios'

const getAll = (params) => {
  return axios.get('/users', { params })
}

const save = (user) => {
  return (user._id ? axios['post'] : axios['put'])('/users', user)
}

const deleteById = (id) => {
  return axios.delete(`/users/${id}`)
}

export default {
  getAll,
  save,
  deleteById
}
