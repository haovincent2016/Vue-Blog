import axios from 'axios'

export const getFriends = (id) => {
    return axios({
        method: 'get',
        url: '/auth/list/' + id
    })
}

export const checkState = (data) => {
    return axios({
        method: 'get',
        url: '/auth/state',
        params: data
    })
}

export const checkRequest = (data) => {
    return axios({
        method: 'get',
        url: '/auth/applystate',
        params: data
    })
}

export const acceptFriendRequest = (id) => {
    return axios({
        method: 'post',
        url: '/auth/friends/accept/' + id,
    })
}

export const rejectFriendRequest = (id) => {
    return axios({
        method: 'post',
        url: '/auth/friends/reject/' + id,
    })
}

export const sendFriendRequest = (data) => {
    return axios({
        method: 'post',
        url: '/auth/friends/apply',
        data: data
    })
}

export const getFriendRequests = (id) => {
    return axios({
        method: 'get',
        url: '/auth/friends/' + id
    })
}

export const getMessage = (data) => {
    return axios({
        method: 'get',
        url: '/auth/messages/onetoone',
        params: data
    })
}

export const sendMessage = (data) => {
    return axios({
        method: 'post',
        url: '/auth/messages/sendtoone',
        data: data
    })
}

export const searchUser = (data) => {
    return axios({
        method: 'get',
        url: '/auth/users',
        params: data
    })
}
