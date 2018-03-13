import axios from 'axios'

export const getUserComments = (id, page) => {
    return axios({
        method: 'get',
        url: '/usercomments/' + id,
        params: {
            page: page
        }
    })
}

export const getComments = (article, sort) => {
    return axios({
        method: 'get',
        url: '/m/number',
        params: { 
            articleid: article, 
            sort: sort
        } 
    })
}

export const getAuthorComments = (article, author) => {
    return axios({
        method: 'get',
        url: '/m/authoronly',
        params: { 
            articleid: article, 
            authorid: author 
        } 
    })
}

export const getCommentsNumber = (article) => {
    return axios({
        method: 'get',
        url: '/m/number',
        params: { 
            articleid: article
        }
    })
}

export const getComment = (id) => {
    return axios({
        method: 'get',
        url: '/m/comment/' + id
    })
}

export const addLike = (commentid) => {
    return axios({
        method: 'post',
        url: '/m/addlike',
        data: { 
            comment: commentid
        }
    })
}

export const cancelLike = (commentid) => {
    return axios({
        method: 'post',
        url: '/m/cancellike',
        data: { 
            comment: commentid
        }
    })
}

export const postComment = (article, content, userid) => {
    return axios({
        method: 'post',
        url: '/m/comment',
        data: { 
            articleid: article, 
            content: content, 
            author: userid
        }
    })
}

export const postSubcomment = (articleid, content, authorid, replyid) => {
    return axios({
        method: 'post',
        url: '/m/subcomment',
        data: { 
            articleid: articleid, 
            content: content, 
            author: authorid, 
            reply: replyid
        }
    })
}

export const addToComment = (comment, subid) => {
    return axios({
        method: 'post',
        url: '/m/addtocomment',
        data: { 
            comment: comment, 
            subid: subid
        }
    })
}

export const updateRecord = (article, add) => {
    return axios({
        method: 'post',
        url: '/m/article',
        data: { 
            articleid: article, 
            add: add 
        }
    })
}

export const closeComment = (articleid, close) => {
    return axios({
        method: 'post',
        url: '/m/closecomment',
        data: {
            articleid: articleid, 
            close: close
        }
    })
}