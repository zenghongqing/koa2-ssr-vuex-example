import axios from 'axios'

const baseUrl = (DEV ? '/' : 'http://localhost:3000/')

export function fetchItem (id) {
    return axios.get(`${baseUrl}api/items/${id}`)
}

export function fetchItems () {
    return axios.get(`${baseUrl}api/items`)
}

export function addItem (item) {
    console.log(item, '传送字段')
    return axios.post(`${baseUrl}api/items`, item)
}