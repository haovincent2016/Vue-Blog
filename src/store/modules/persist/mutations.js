import {
    USER,
    ASSIGN_ID,
    CHANGE_STATE,
    CHANGE_ADMIN,
    CHANGE_COVER,
    PUSH_HISTORY
} from '../../mutation-types.js'

export default {
    //user basic info
    [USER](state, info) {
        state.user = {...info}
    },
    //change user cover image path
    [CHANGE_COVER](state, path) {
        state.user.avatar = path;
    },
    //assign id to user
    [ASSIGN_ID](state, id) {
        state.user.id = id;
    },
    //user either login or not
    [CHANGE_STATE](state, value) {
        state.isLogin = value;
    },
    //admin either login or not
    [CHANGE_ADMIN](state, value) {
        state.isManaging = value
    },
    [PUSH_HISTORY](state, value) {
        if(value === 'clear') {
            state.searchHistory.splice(0, 5)
            return
        }
        if(state.searchHistory.indexOf(value) === -1) {
            state.searchHistory.unshift(value)
        } 
        if(state.searchHistory.length > 5) {
            state.searchHistory.pop() 
        }
    }
}