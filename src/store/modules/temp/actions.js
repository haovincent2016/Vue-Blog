export default {
    switchLogin({commit}, login) {
        commit('SWITCH_LOGIN', login)
    },
    displayModal({commit}, value) {
        commit('DISPLAY_MODAL', value.display)
        commit('SWITCH_LOGIN', value.login)
    },
    searchState({commit}, value) {
        commit('SEARCH_STATE', value)
    }
} 