const axios = require('axios')

const quintoAPI = axios.create({
    baseURL: 'https://financiamento.quintoandar.com.br/property/'
})

const feeAPI = axios.create({
    baseURL: 'https://www.quintoandar.com.br/taxfees/api/v2/taxes/all/'
})

const loftAPI = axios.create({
    baseURL: 'https://api.loft.com.br/listings/'
})

module.exports = {
    quintoAPI,
    feeAPI,
    loftAPI
 }