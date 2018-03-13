import axios from 'axios'
import Cookies from 'js-cookie'

export const registerUser = (request) => {
    return axios.post('/auth/register', request)
}

export const loginUser = (request) => {
    return axios({
        method: 'post',
        url: '/auth/login',
        data: request
    })
}

export const loginJWT = () => {
    return axios({
        method: 'post',
        url: '/auth/loginJWT'
    })
}

export const logoutUser = () => {
    if(localStorage.getItem('persist')) {
        localStorage.removeItem('persist')
    }
    if(Cookies.get('token')) {
        Cookies.remove('token')
    }
    return axios({
        method: 'post',
        url: '/auth/logout'
    })
}

export const getUser = (id) => {
    return axios({
        method: 'get',
        url: '/auth/userInfo/' + id
    })
}

export const editUser = (request) => {
    return axios({
        method: 'post',
        url: '/auth/editUser',
        data: request
    })
}

export const myArticles = (id, page) => {
    return axios({
        method: 'get',
        url: '/auth/userArticles/' + id,
        params: page
    })
}
