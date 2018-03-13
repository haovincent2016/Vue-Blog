export default {
    changeUser({commit}, info) {
        commit('USER', info)
    },
    assignID({commit}, id) {
        commit('ASSIGN_ID', id)
    },
    changeState({commit}, value) {
        commit('CHANGE_STATE', value)
    },
    changeAdmin({commit}, value) {
        commit('CHANGE_ADMIN', value)
    },
    changeCover({commit}, path) {
        commit('CHANGE_COVER', path)
    },
    pushHistory({commit}, value) {
        commit('PUSH_HISTORY', value)
    }
} 