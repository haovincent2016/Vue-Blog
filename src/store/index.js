import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import persist from './modules/persist'
import temp from './modules/temp'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        persist,
        temp
    },
    plugins: [
        createPersistedState({
            key: 'persist',
            paths: [
                'persist'
            ]
        })
    ]
})