import axios from 'axios'
const baseUrl = "/api/persons"


const getAll = () => {
    const promise = axios.get(baseUrl)
    return promise.then(response => response.data)
}

const addNew = (newPerson) => {
    const promise = axios.post(baseUrl, newPerson)
    return promise.then(response => response.data)
}

const delPerson = (id) => {
    const promise = axios.delete(`${baseUrl}/${id}`)
    return promise.then(response => response.data)
}

const updatePerson = (updatedProfile) =>{
    const promise = axios.put(`${baseUrl}/${updatedProfile.id}`, updatedProfile)
    return promise.then(response => response.data)
}

export default {getAll, addNew, delPerson, updatePerson}