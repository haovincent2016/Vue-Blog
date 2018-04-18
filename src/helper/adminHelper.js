import axios from 'axios'

export const registerUser = (request) => {
    let admintoken = localStorage.getItem('admintoken')
    if(!!admintoken) {
        localStorage.removeItem('admintoken')
        return axios.post('/admin/register', request)
    }
    return axios.post('/admin/register', request)
}

export const loginUser = (request) => {
    let admintoken = localStorage.getItem('admintoken')
    if(!!admintoken) {
        return axios({
            method: 'post',
            url: '/admin/loginJWT',
            headers: {
                authorization: admintoken
            },
            data: request
        })
    }
    return axios({
        method: 'post',
        url: '/admin/login',
        data: request
    })
}

export const logoutUser = () => {
    return axios({ 
        method: 'get',
        url: '/admin/logout',
        headers: {
            authorization: localStorage.getItem('admintoken')
        }  
    })
}

export const getUsers = (data) => {
    return axios({
        method: 'post',
        url: '/admin/users',
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const getUsersNumber = () => {
    return axios({
        method: 'get',
        url: '/admin/userscount',
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const getBlacklist = (data) => {
    return axios({
        method: 'post',
        url: '/admin/blacklist',
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken') 
        }
    })
}

export const getBannedNumber = () => {
    return axios({
        method: 'get',
        url: '/admin/bannedcount',
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const unbanUser = (userid) => {
    return axios({
        method: 'patch',
        url: '/admin/unban/' + userid,
        headers: {
            authorization: localStorage.getItem('admintoken') 
        }
    })
}
    
export const editUser = (userid, data) => {
    return axios({
        method: 'patch',
        url: '/admin/user/' + userid,
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const deleteUser = (userid) => {
    return axios({
        method: 'delete',
        url: '/admin/user/' + userid,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const getTagsNumber = () => {
    return axios({
        method: 'get',
        url: '/admin/tags',
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const getTags = (data) => {
    return axios({
        method: 'post',
        url: '/admin/tags',
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const addTag = (data) => {
    return axios({
        method: 'post',
        url: '/admin/tag',
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const editTag = (tagid, data) => {
    return axios({
        method: 'put',
        url: '/admin/tag/' + tagid,
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const deleteTag = (tagid) => {
    return axios({
        method: 'delete',
        url: '/admin/tag/' + tagid,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const getArticlesNumber = () => {
    return axios({
        method: 'get',
        url: '/admin/articlescount',
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const getArticles = (data) => {
    return axios({
        method: 'post',
        url: '/admin/articles',
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const editArticle = (articleid, data) => {
    return axios({
        method: 'patch',
        url: '/admin/article/' + articleid,
        data: data,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}

export const deleteArticle = (articleid) => {
    return axios({
        method: 'delete',
        url: '/admin/article/' + articleid,
        headers: {
            authorization: localStorage.getItem('admintoken')
        }
    })
}
