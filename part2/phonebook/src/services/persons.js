import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    console.log('GET request to:', baseUrl)

    return axios.get(baseUrl).then(response => {
        console.log('Data received from backend:', response.data)
        return response.data
    })
}

const create = newObject => {
    console.log('POST request to:', baseUrl)
    console.log('Data being sent:', newObject)

    return axios.post(baseUrl, newObject).then(response => {
        console.log('Created person:', response.data)
        return response.data
    })
}

const update = (id, newObject) => {
    console.log('PUT request to:', `${baseUrl}/${id}`)
    console.log('Updated data:', newObject)

    return axios.put(`${baseUrl}/${id}`, newObject).then(response => {
        console.log('Updated person:', response.data)
        return response.data
    })
}

const remove = id => {
    console.log('DELETE request to:', `${baseUrl}/${id}`)

    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll,
    create,
    update,
    remove,
}