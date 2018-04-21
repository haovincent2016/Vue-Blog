let baseUrl = ''

if (process.env.NODE_ENV == 'production'){
    baseUrl = 'https://vincenthao.info';
} else {
    baseUrl = 'http://localhost:3001'
}

export {
    baseUrl
}