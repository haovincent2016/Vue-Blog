import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
    login: 'login', //need login or register 
    displayModal: false, //open login and register modal  
    startSearching: false, //searched or not 
    searchText: '' 
}

export default {
    state,
    actions,
    mutations,
    getters
}