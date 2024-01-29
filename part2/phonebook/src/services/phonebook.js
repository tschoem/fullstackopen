import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = () => {
  const request =  axios.get(baseUrl)
  /*const nonExisting = {
    id: 10000,
    name: 'Alpha Beta',
    number: '09876543',
  }*/
  return request.then(response => response.data)
}

const createEntry = newObject => {
  const request =   axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updateNumber = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteNumber = (id, newObject) => {
    const request = axios.delete(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, createEntry, updateNumber, deleteNumber }
