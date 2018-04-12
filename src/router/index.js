import Vue from 'vue'
import Router from 'vue-router'

const Editor = r => require.ensure([], () => r(require('../pages/Editor')), 'Editor')
const Home = r => require.ensure([], () => r(require('../pages/Home')), 'Home')
const Setting = r => require.ensure([], () => r(require('../pages/Setting')), 'Setting')
const Collection = r => require.ensure([], () => r(require('../pages/Collection')), 'Collection')
const Dashboard = r => require.ensure([], () => r(require('../pages/Dashboard')), 'Dashboard')
const UserPage = r => require.ensure([], () => r(require('../pages/UserPage')), 'UserPage')
const Signin = r => require.ensure([], () => r(require('../pages/Signin')), 'Signin')
const Signup = r => require.ensure([], () => r(require('../pages/Signup')), 'Signup')
const Login = r => require.ensure([], () => r(require('../pages/Login')), 'Login')
const Admin = r => require.ensure([], () => r(require('../pages/Admin')), 'Admin')
const Video = r => require.ensure([], () => r(require('../pages/Video')), 'Video')

const AdminHome = r => require.ensure([], () => r(require('../admin/Home')), 'AdminHome')
const ArticleManage = r => require.ensure([], () => r(require('../admin/Article')), 'ArticleManage')
const CollectionManage = r => require.ensure([], () => r(require('../admin/Collection')), 'CollectionManage')
const CommentManage = r => require.ensure([], () => r(require('../admin/Comment')), 'CommentManage')
const MediaManage = r => require.ensure([], () => r(require('../admin/Media')), 'MediaManage')
const UserManage = r => require.ensure([], () => r(require('../admin/User')), 'UserManage')
const TagManage = r => require.ensure([], () => r(require('../admin/Tag')), 'TagManage')
const Blacklist = r => require.ensure([], () => r(require('../admin/Blacklist')), 'Blacklist')

const MainChat = r => require.ensure([], () => r(require('../components/chat/MainChat')), 'MainChat')
const UserChat = r => require.ensure([], () => r(require('../components/chat/UserChat')), 'UserChat')

const Article = r => require.ensure([], () => r(require('../components/blog/Article')), 'Article')
const CollectionDetail = r => require.ensure([], () => r(require('../components/blog/CollectionDetail')), 'CollectionDetail')
const Search = r => require.ensure([], () => r(require('../components/blog/Search')), 'Search')
const TagDetail = r => require.ensure([], () => r(require('../components/blog/TagDetail')), 'TagDetail')

const Basic = r => require.ensure([], () => r(require('../components/user/BasicSetting')), 'Basic')
const Account = r => require.ensure([], () => r(require('../components/user/Account')), 'Account')
const MyArticles = r => require.ensure([], () => r(require('../components/user/UserArticles')), 'MyArticles')
const MyComments = r => require.ensure([], () => r(require('../components/user/UserComments')), 'MyComments')
const MyActivities = r => require.ensure([], () => r(require('../components/user/UserActivities')), 'MyActivities')

const SingleVideo = r => require.ensure([], () => r(require('../components/video/SingleVideo')), 'SingleVideo')

Vue.use(Router)

export default new Router({
    mode: 'hash',
    scrollBehavior: function (to, from, savedPosition) {
        //return savedPosition || { x: 0, y: 0 }
        if (to.hash) {
            return {selector: to.hash}
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        { 
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/video',
            name: 'video',
            component: Video
        },
        {
            path: '/video/:id',
            name: 'single',
            component: SingleVideo
        },
        {
            path: '/signin',
            name: 'signin',
            component: Signin
        },
        {   
            path: '/signup',
            name: 'signup',
            component: Signup
        },
        {
            path: '/editor',
            name: 'editor',
            component: Editor,
            meta: {
                requireAuth: true
            } 
        },
        {
            path: '/userpage/:id',
            component: UserPage
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: {
                requireAuth: true
            },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: MyArticles
                },
                {
                    path: 'articles',
                    component: MyArticles
                }, 
                {
                    path: 'activities',
                    component: MyActivities
                },
                {
                    path: 'comments',
                    component: MyComments
                },
                {
                    path: 'chats',
                    component: MainChat
                },
                {
                    path: 'userchat/:id',
                    component: UserChat 
                }, 
            ]
        },
        {
            path: '/setting',
            component: Setting,
            meta: {
                requireAuth: true
            },
            children: [
                {
                    path: '',
                    component: Basic,
                    name: 'setting'
                },
                {
                    path: 'basic',
                    component: Basic
                }, 
                {
                    path: 'account',
                    component: Account
                }
            ]
        },
        {
            path: '/articles/:id',
            name: 'article',
            component: Article
        },
        {
            path: '/mycollect',
            name: 'collection',
            component: Collection
        },
        {
            path: '/mycollect/:id',
            component: CollectionDetail
        },
        {
            path: '/search',
            name: 'search',
            component: Search
        },
        {
            path: '/tagdetail/:id',
            component: TagDetail
        },
        /* admin route */
        {
            path: '/admin',
            name: 'login',
            component: Login
        },
        { 
            path: '/adminpanel',
            component: Admin,
            meta: {
                requireAdmin: true
            },
            children: [{
                path: '',
                component: AdminHome
            }, {
                path: 'manageusers',
                component: UserManage
            }, {
                path: 'blacklist',
                component: Blacklist
            }, {
                path: 'managetags',
                component: TagManage
            }, {
                path: 'managearticles',
                component: ArticleManage   
            }, {
                path: 'managecomments',
                component: CommentManage   
            } ]
        } 
    ]
})
