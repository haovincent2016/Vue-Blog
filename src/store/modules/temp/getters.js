export default {
    getLogin: state => { return state.login },
    getModal: state => { return state.displayModal },
    getSearch: state => { return state.startSearching },
    getSearchText: state => { return state.searchText }
}