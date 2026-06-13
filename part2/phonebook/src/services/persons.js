import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    // This function sends a GET request to the base URL.
    // The server responds with the full list of persons stored in the phonebook.
    console.log('personService.getAll: sending request for all persons')
    const request = axios.get(baseUrl)
    return request.then(response => {
        // response.data contains the actual array returned by the server.
        // The function returns only that data so App receives the persons directly.
        console.log('personService.getAll: received all persons response', response.data)
        return response.data
    })
}

const create = newObject => {
    // This function sends a POST request to the base URL.
    // newObject is sent in the request body so the server can create a new person.
    console.log('personService.create: sending create request', newObject)
    const request = axios.post(baseUrl, newObject)
    return request.then(response => {
        // response.data contains the created person returned by the server.
        // This usually includes the id assigned by the backend.
        console.log('personService.create: received created person response', response.data)
        return response.data
    })
}

const update = (id, newObject) => {
    // This function sends a PUT request to the URL for one specific person.
    // id selects which person should be updated.
    // newObject is sent in the request body as the new version of that person's data.
    console.log('personService.update: sending update request', { id, newObject })
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => {
        // response.data contains the updated person returned by the server.
        // The function returns that updated object back to App.
        console.log('personService.update: received updated person response', response.data)
        return response.data
    })
}

const remove = id => {
    // This function sends a DELETE request to the URL for one specific person.
    // id selects which person should be removed from the backend.
    console.log('personService.remove: sending delete request', id)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => {
        // response.data contains the server response after deletion.
        // The function returns that response so the caller knows the request finished.
        console.log('personService.remove: received delete response', response.data)
        return response.data
    })
}

export default { getAll, create, update, remove }
