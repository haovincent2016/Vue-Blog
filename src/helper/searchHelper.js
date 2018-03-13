import axios from 'axios'

export const searchArticle = (text, page) => {
    return axios({
        method: 'get',
        url: '/v/search',
        params: {
            text: text,
            page: page
        }
    })
}