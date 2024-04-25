import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async blogToUpdate => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${blogToUpdate.id}`, blogToUpdate, config)
  return response.data
}

const remove = async blogToDelete => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blogToDelete}`, config)
  return response
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export default { getAll, setToken, create, update, remove }