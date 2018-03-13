import axios from 'axios'

export const getArticles = (page) => {
    return axios({
        method: 'get',
        url: '/v/articles',
        params: {
            page: page
        }
    })
}
export const getTrending = (num, total) => {
    return axios({
        method: 'get',
        url: '/v/trendingarticles',
        params: {
            num: num,
            total: total
        }
    })
}
export const getHot = (num, total) => {
    return axios({
        method: 'get',
        url: '/v/hotarticles',
        params: {
            num: num,
            total: total
        }
    })
}
export const getArticle = (id) => {
    return axios({
        method: 'get',
        url: '/v/articles/' + id
    })
}
export const addView = (id) => {
    return axios({
        method: 'post',
        url: '/v/addView/' + id
    })
}
export const getCount = () => {
    return axios({
        method: 'get',
        url: '/v/count'
    })
}
export const getUserCount = (id) => {
    return axios({
        method: 'get',
        url: '/v/usercount/' + id
    })
}
export const getSearchCount = (data) => {
    return axios({
        method: 'get',
        url: '/v/searchcount',
        params: {
            text: data
        }
    })
}
export const getLike = (id) => {
        return axios({
            method: 'get',
            url: '/v/like/' + id
        })
    }
export const checkLike = (article, user) => {
    return axios({
        method: 'get',
        url: '/v/likestate',
        params: {
            articleid: article,
            userid: user
        }
    })
}
export const checkSub = (user, author) => {
    return axios({
        method: 'get',
        url: '/v/substate',
        params: {
            id: user,
            author: author
        }
    })
}
export const countSub = (author) => {
    return axios({
        method: 'get',
        url: '/v/subcount',
        params: {
            author: author
        }
    })
}
export const addLike = (data) => {
    return axios({
        method: 'post',
        url: '/v/addLike',
        data: data
    })
}
export const cancelLike = (data) => {
    return axios({
        method: 'post',
        url: '/v/cancelLike',
        data: data
    }) 
}
export const subscribe = (data) => {
    return axios({
        method: 'post',
        url: '/v/subscribe',
        data: data
    }) 
}
export const unsubscribe = (data) => {
    return axios({
        method: 'post',
        url: '/v/unsubscribe',
        data: data
    }) 
}
export const writeArticle = (data) => {
    return axios({
        method: 'post',
        url: '/v/articles',
        data: data
    })
}

export const getTags = () => {
    return axios({
        method: 'get',
        url: '/v/tags'
    })
}

export const getTag = (id) => {
    return axios({
        method: 'get',
        url: '/v/tags/' + id,
    })
}

export const subTag = (data) => {
    return axios({
        method: 'post',
        url: '/v/subtag',
        data: data
    })
}

export const unsubTag = (data) => {
    return axios({
        method: 'post',
        url: '/v/unsubtag',
        data: data
    })
}

//get all user subscribed tags
export const getUserTags = (data) => {
    return axios({
        method: 'post',
        url: '/v/usertags',
        data: data
    })
}

//add tag to user tags
export const addUser = (data) => {
    return axios({
        method: 'post',
        url: '/v/addto',
        data: data
    })
}

//remove tag from user tags
export const removeUser = (data) => {
    return axios({
        method: 'post',
        url: '/v/removefrom',
        data: data
    })
}

//check if comments open
export const checkComments = (data) => {
    return axios({
        method: 'post',
        url: '/v/checkcomments',
        data: data
    })
}



