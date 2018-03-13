export default {
    getUser: state => { return state.user },
    getState: state => { return state.isLogin },
    getAdmin: state => { return state.isManaging },
    getHistory: state => { return state.searchHistory },
    getID: state => { return state.user.id },
    getAvatar: state => { return state.user.avatar }
}