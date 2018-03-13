import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
    user: {}, //user id, name, email and avatar path
    isLogin: false, //user login state
    isManaging: false, //admin login state
    searchHistory: [], //user search history(max 5)
}

export default {
    state,
    actions,
    mutations,
    getters
}