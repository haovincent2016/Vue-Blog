import {
    SWITCH_LOGIN,
    DISPLAY_MODAL,
    SEARCH_STATE
} from '../../mutation-types.js'

export default {
    //need either login or register
    [SWITCH_LOGIN](state, login) {
        state.login = login
    },
    //display login modal or not
    [DISPLAY_MODAL](state, value) {
        state.displayModal = value
    },
    [SEARCH_STATE](state, value) {
        state.startSearching = value.state
        state.searchText = value.text
    }
}