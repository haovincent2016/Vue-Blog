import axios from 'axios'

export const getUserCollections = (owner) => {
    return axios({
        method: 'post',
        url: '/c/collections',
        data: { 
            owner: owner
        } 
    })
}

export const getCollection = (id) => {
    return axios({
        method: 'get',
        url: '/c/collections/' + id
    })
}

export const updateCollection = (id) => {
    return axios({
        method: 'patch',
        url: '/c/collections/' + id
    })
}

export const deleteCollection = (id) => {
    return axios({
        method: 'delete',
        url: '/c/collections/' + id
    })
}

export const createCollection = (request) => {
    return axios({
        method: 'post',
        url: '/c/new',
        data: request
    })
}

export const addArticle = (request) => {
    return axios({
        method: 'post',
        url: '/c/add',
        data: request
    })
}
//add to frontend later
export const removeArticle = () => {
    return axios({
        method: 'delete',
        url: '/c/remove'
    })
}

export const editTitle = (collectionid, name) => {
    return axios({
        method: 'post',
        url: '/c/editTitle',
        data: {
            collectionid: collectionid, 
            name: name
        }
    })
}

export const editDesc = (collectionid, description) => {
    return axios({
        method: 'post',
        url: '/c/editDesc',
        data: {
            collectionid: collectionid,
            description: description
        }
    })
}

export const subscribeCollection = (collectionid, userid) => {
    return axios({
        method: 'post',
        url: '/c/subscribe',
        data: {
            collectionid: collectionid,
            userid: userid
        }
    })
}

export const unsubscribeCollection = (collectionid, userid) => {
    return axios({
        method: 'post',
        url: '/c/unsubscribe',
        data: {
            collectionid: collectionid,
            userid: userid
        }
    })
}