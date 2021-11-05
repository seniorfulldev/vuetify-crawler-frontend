import axios from 'axios'
import eventBus from '@/eventBus'

const resOk = (res) => {
  eventBus.$emit('notification.info', res)

  return res
}

const resError = (err) => {
  eventBus.$emit('notification.error', err)

  return Promise.reject(err)
}

axios.defaults.baseURL = '/api'
axios.defaults.timeout = 60000
axios.interceptors.response.use(resOk, resError)

export default axios
