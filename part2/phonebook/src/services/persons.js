import { apiClient, setToken } from './apiClient'

const getAll = () => {
  return apiClient.get('/persons').then(response => response.data)
}

const create = newObject => {
  return apiClient.post('/persons', newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return apiClient.put(`/persons/${id}`, newObject).then(response => response.data)
}

const remove = id => {
  return apiClient.delete(`/persons/${id}`).then(response => response.data)
}

export default {
  create,
  getAll,
  remove,
  setToken,
  update,
}
