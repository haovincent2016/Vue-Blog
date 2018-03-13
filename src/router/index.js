import Vue from 'vue'
import Router from 'vue-router'
import Editor from '../pages/Editor'
import Home from '../pages/Home'
import Setting from '../pages/Setting'
import Collection from '../pages/Collection'
import Dashboard from '../pages/Dashboard'
import UserPage from '../pages/UserPage'
import Signin from '../pages/Signin'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import Admin from '../pages/Admin'

import AdminHome from '../admin/Home'
import ArticleManage from '../admin/Article'
import CollectionManage from '../admin/Collection'
import CommentManage from '../admin/Comment'
import MediaManage from '../admin/Media'
import UserManage from '../admin/User'
import TagManage from '../admin/Tag'
import Blacklist from '../admin/Blacklist'

import Article from '../components/blog/Article'
import CollectionDetail from '../components/blog/CollectionDetail'
import Search from '../components/blog/Search'
import TagDetail from '../components/blog/TagDetail'

import Basic from '../components/user/BasicSetting'
import Account from '../components/user/Account'
import MyArticles from '../components/user/UserArticles'
import MyComments from '../components/user/UserComments'
import MyActivities from '../components/user/UserActivities'

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
                }
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
