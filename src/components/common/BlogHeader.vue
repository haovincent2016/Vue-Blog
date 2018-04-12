<template>
<div class="header-wrapper">
    <div class="header-container">
        <div v-if="!scrolled || scrolledDirection === 'up'" class="main-header">
            <a href="/" class="logo">
                <img src="/static/xiaomai.png" alt="blog" class="logo-img">
            </a>
            <nav role="navigation" class="main-nav">
                <ul class="nav-list">
                    <div class="main-nav-list" @click="isShown=!isShown">
                        <!--mobile header-->
                        <div class="phone-show">
                            <router-link :to="{name: 'home'}">Home</router-link>
                            <div v-show="isShown === false" class="fa fa-caret-down fa-leftmargin"></div>
                            <div v-show="isShown === true" class="fa fa-caret-up fa-leftmargin"></div>
                        </div>
                        <div class="computer-hide" :class="{ menushow: isShown}">
                            <li class="nav-item">
                                <router-link :to="{name: 'home'}">Home</router-link>
                            </li>
                            <li class="nav-item">
                                <a >Articles</a>
                            </li>
                            <li class="nav-item">
                                <a>Video</a>
                            </li>
                            <li class="nav-item">
                                <a >Musics</a>
                            </li>
                        </div>
                    </div>
                    <!--search-bar-->
                    <li class="nav-item search" @mouseover="showSearch = true" @mouseleave="showSearch = false">
                        <div :class="{ bgactive: focused }" class="search-form">
                            <input
                                v-model="tempText"
                                placeholder="search articles" 
                                class="search-input"
                                @focus="focused = true"
                                @blur="focused = false"
                                @keyup.enter="search">
                            <i alt="search" :class="{ iconactive: focused }" class="fa fa-search" @click="search"></i>
                        
                            <ul v-if="showSearch && searchHistory.length > 0" class="dropdown-search">
                                <!--search history-->
                                <li class="search-title">
                                    <a class="search-clear" @click="clearHistory">Clear</a>
                                    <i class="search-icon fa fa-clock-o"></i><span>Recent(5)</span>
                                </li>
                                <li class="suggest-item" v-for="(item, index) in searchHistory" :key="item.id" @click="searchOld(index)">
                                    <a>{{ item }}</a>
                                </li>
                                <!--trending search
                                <li class="search-title">
                                    <i class="search-icon fa fa-line-chart"></i><span>Top</span>
                                </li>
                                <li class="suggest-item">
                                    <i class="item-index">1</i>
                                    <a href="" target="_blank"></a>
                                </li>-->
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item submit">
                        <router-link :to="{ name: 'editor' }"><i class="fa fa-pencil-square-o"></i><span>Write</span></router-link>
                    </li>
                    <!--before login-->
                    <li v-if="loginState === false" class="nav-item auth">
                        <router-link :to="{ name: 'signin', query: { redirect: this.$route.path } }"><span class="login">Login</span></router-link>
                        <router-link :to="{ name: 'signup', query: { redirect: this.$route.path } }"><span class="register">Register</span></router-link>
                    </li>
                    <!--after login-->
                    <li v-if="loginState === true" class="nav-item" @mouseover="isOpen=true" @mouseleave="isOpen=false">
                        <div class="user">
                            <div>
                                <a class="avatar"><img :src="userpic" alt="120"></a>
                            </div>
                            
                            <ul class="dropdown-menu" v-show="isOpen === true">
                                <li>
                                    <router-link :to="{ name: 'dashboard' }"><i class="fa fa-user"></i><span>My Homepage</span></router-link>      
                                </li>
                                <li>
                                    <router-link :to="{ name: 'collection' }"><i class="fa fa-bookmark"></i><span>My Collections</span></router-link>        
                                </li>
                                <li>
                                    <router-link :to="{ name: 'setting' }"><i class="fa fa-cog"></i><span>Settings</span></router-link>         
                                </li>
                                <li>
                                    <a @click="logout">
                                        <i class="fa fa-sign-out"></i><span>Logout</span>
                                    </a>          
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        <div v-if="scrolled && scrolledDirection === 'down'" class="article-header">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-author">by {{ article.author.name }}</p>
            <div class="article-operation">
                <button class="subscribe" @click="addArticle()">Collection</button>
                <button class="comment" v-scroll-to="'#commentarea'">Comment</button>
            </div>
        </div>
    </div>
    <!--collection box-->
    <box :display="isDisplay"
        :article="article_id" 
        @open="isDisplay = true" 
        @close="isDisplay = false">
    </box>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { logoutUser } from '@/helper/userHelper'
import { getArticle } from '@/helper/articleHelper'
import Box from './CollectionBox'

export default {
    created () {
        this.initialPosition = document.body.pageYOffset || document.body.scrollTop
        document.body.addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
        document.body.removeEventListener('scroll', this.handleScroll)
    },
    mounted() {
        const that = this
		this.$store.watch(() => { return that.$store.getters.getSearchText}, (val) => {
           that.tempText = val
        })
        if(this.$route.name === 'article') {
            this.retrieveArticle()
        }
    },
    data() {
        return {
            //show mobile menu on smaller size
            showMobileMenu: false,
            //show secondary mobile menu
            isShown: false,
            //show search box border
            focused: false,
            //show user dropdown
            isOpen: false,
            //show search dropdown
            showSearch: false,
            /*display collection box*/
            isDisplay: false,
            tempText: '',
            initialPosition: 0,
            currentPosition: 0,
            scrolledDirection: 'down',
            scrolled: false,
            article: {},
            article_id: ''
        }
        
    },
    computed: {
        ...mapGetters({
            loginState: 'getState',
            userid: 'getID',
            userpic: 'getAvatar',
            searchState: 'getSearch',
            searchText: 'getSearchText',
            searchHistory: 'getHistory'
        })
    },
    watch: {
        '$route.name': function(name) {
            if(name === 'article') {
                this.retrieveArticle()
            } else {
                this.scrolled = false
            }
        }
    },
    methods: {
        handleScroll () {
            if(this.$route.name === 'article') {
                this.currentPosition = document.body.pageYOffset || document.body.scrollTop
                if(this.currentPosition > this.initialPosition){
                    this.scrolled = true
                    this.scrolledDirection = 'down'
                } else if(this.currentPosition < this.initialPosition){
                    this.scrolled = true
                    this.scrolledDirection = 'up'
                } 
                this.initialPosition = this.currentPosition 
            } else {
                return
            }           
        },
        async retrieveArticle() {
            try {
                const res = await getArticle(this.$route.params.id)
                this.article = res.data
                this.article_id = res.data._id
            } catch(err) {
                console.log(err)
            }
        },
        addArticle() {
            if(this.loginState) {
                this.isDisplay = !this.isDisplay
            } else {
                this.$store.dispatch('displayModal', { display: true, login: 'login' })
            }
        },
        toggleShow() {
            this.isShown = !this.isShown
        },
        search() {
            if(!this.tempText) {
				this.$router.push({ name: 'search' })
			} else if (this.$route.path === '/search') {
                this.$store.dispatch('searchState', {state: true, text: this.tempText})
				this.$store.dispatch('pushHistory', this.tempText)
            } else {
                this.$router.push({ name: 'search', params: {search: this.tempText} })
			}
        },
        searchOld(index) {
            if (this.$route.path === '/search') {
                this.$store.dispatch('searchState', {state: true, text: this.searchHistory[index]})
            } else {
                this.$router.push({ name: 'search', params: {search: this.searchHistory[index]} })
			}
        },
        clearHistory() {
            this.$store.dispatch('pushHistory', 'clear')
        },
        logout() {
            const that = this
            logoutUser()
            this.$notify({
                title: 'Success',
                type: 'success',
                message: 'you are logged out',
                position: 'top-left'
            })
            setTimeout(function(){ that.$router.go(that.$router.currentRoute) }, 1000)
        }
    },
    components: {
        Box
    }
    
}
</script>
<style lang="scss" scoped>
/*user menu*/
.user {
    margin-top: 5px;
    .avatar {
        margin: 6px;
        img {
            width: 40px;
            height: 40px;
            border: 1px solid #ddd;
            border-radius: 50%;
        }
    }
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 10;
    float: left;
    min-width: 180px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,.175);
    margin-top: 0;
    @media screen and (max-width: 420px) {
        min-width: 120px;
        padding: 0 0 0 10px;
    }
    li {
        line-height: 20px;
        a {
            display: block;
            font-weight: 400;
            color: #333;
            cursor: pointer;
            line-height: 34px;
            width: 100%;
            span {
                font-size: 15px;
            }
        }
        &:hover {
            background-color: #f5f5f5;
        }
    }
}

.dropdown-search {
    position: absolute;
    top: 84%;
    z-index: 10;
    width: 205px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,.175);
    .search-title {
        padding: 0 0 0 10px;
        line-height: 23px;
        background: #f4f4f4;
        color: #9b9b9b;
        cursor: default;
        .search-clear {
            float: right;
            padding: 0 10px;
        }
        .search-icon {
            margin-right: 7px;
            margin-left: 0;
        }
    }
    .suggest-item {
        cursor: pointer;
        word-wrap: break-word;
        word-break: break-all;
        display: block;
        color: #222;
        position: relative;
        padding: 0 13px 5px; 
        margin: 4px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid #f7f7f7;
        .item-index {
            text-align: center;
            background: #00a1d6;
            color: #fff;
            padding: 2px 6px;
            margin-right: 1px;
        }
        .cancel {
            float: right;
            padding-top: 2px;
            width: 30px;
        }
    }
}

.header-wrapper {
    height: 60px;
    position: relative;
    .header-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fff;
        border-bottom: 1px solid #f1f1f1;
        color: #909090;
        height: 60px;
        z-index: 100;
        .main-header {
            max-width: 980px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            position: relative;
            margin: 0 auto;
            width: 100%;
            @media screen and (max-width: 420px) {
                width: 96%;
            }
            .logo {
                width: 42px;
                height: 42px;
                .logo-img {
                    width: 100%;
                    height: 100%;
                }
                @media screen and (max-width: 420px) {
                    margin-right: 0;
                }
            }
        }
        .article-header {
            max-width: 640px;
            display: flex;
            align-items: center;
            height: 100%;
            position: relative;
            margin: 0 auto;
            width: 100%;
            padding-left: 2%;
            .article-title {
                font-size: 19px;
                line-height: 25px;
                margin-right: 10px;
                width: auto;
                max-width: 240px;
                overflow: hidden;
            }
            .article-author {
                font-size: 14px;
                width: auto;
                max-width: 100px;
                overflow: hidden;
            }
            .article-operation {
                position: absolute;
                top: 26%;
                right: 4%;
                .subscribe {
                    font-size: 14px;
                    padding: 4px 6px;
                    margin-right: 4px;
                    color: #00a1d6;
                    border: 1px solid #00a1d6;
                    border-radius: 5px;
                    background: none;
                    cursor: pointer;
                    &:hover {
                        color:#fff;
                        background:#00a1d6;
                    }
                }
                .comment {
                    font-size: 14px;
                    padding: 4px 6px;
                    color: #00a1d6;
                    border: 1px solid #00a1d6;
                    border-radius: 5px;
                    background: none;
                    cursor: pointer;
                    &:hover {
                        color:#fff;
                        background:#00a1d6;
                    }
                }
            }
        }
    }
}
.main-nav {
    height: 100%;
    flex: auto;
    .nav-list {
        padding: 0;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        height: 100%;
        margin: 0;
        justify-content: flex-end;
        position: relative;
        .main-nav-list {
            display: flex;
            @media screen and (max-width: 420px) {
                display: block;
                position: absolute;
                left: 0;
                top: 0;
                background-color: #fff;
            }
        }
        .nav-item {
            display: flex;
            -webkit-box-align: center;
            color: #71777c;
            padding: 0 1.1rem;
            font-size: 1.33rem;
            align-items: center;
            height: 100%;
            margin: 0;
            -webkit-box-pack: center;
            justify-content: center;
            cursor: pointer;
            
        }
        .nav-item > a:hover {
             color: #00a1d6;
        }
        .search {
            flex: 1 1 auto;
            justify-content: flex-end;
            cursor: auto;
        }
        .submit {
            color: #00a1d6;
            position: relative;
        }
        .auth {
            color: #00a1d6;
            .login:after {
                content: "\B7";
                margin: 0 .4rem;
            }
        }
    }
}
.phone-show {
    display: none;
    @media screen and (max-width: 420px) {
        cursor: pointer;
        height: 5rem;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        color: #00a1d6;
        font-size: 1.3rem;
        justify-content: center;
        padding: 0 0.5rem;
    }
}
.computer-hide {
    display: flex;
    @media screen and (max-width: 420px) {
        background-color: #fff;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
        border: 1px solid hsla(217,5%,71%,.45);
        border-radius: 4px;
        font-size: 1.1rem;
        display: none;
    }
}
@media screen and (max-width: 420px) {
    .menushow {
        display: block;
    }
    .nav-item {
        height: 3.5rem !important;
    }
}
.search-form {
    border: 2px solid #ccd0d7;
    border-radius: 12px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 420px) {
       display: none; 
    }
    img {
        border-style: none;
    }
    .search-input {
        width: 12rem;
        border: none;
        padding: .6rem 1rem;
        box-shadow: none;
        outline: none;
        font-size: 1.2rem;
        color: #666;
        background-color: transparent;
    }
    .search-icon {
        margin: 0 .5rem;
        cursor: pointer;
        position: relative;
    }
}

a {
    text-decoration: none;
    cursor: pointer;
    color: #909090;
    background-color: transparent;
}
ul {
    padding: 0;
}
li {
    list-style: none;
}
.bgactive {
    background-color: #fff;
    border: 2px solid #00a1d6;
}
.iconactive {
    color: #00a1d6 !important;
}
.fa {
    color: #00a1d6;
    margin: 0px 27px 0px 15px;
    width: 14px;
    text-align: center;
    @media screen and (max-width: 420px) {
        margin: 0;
    }
}
.fa-search {
    color: #71777c;
    margin: 0 8px;
    padding: 8px 3px;
    cursor: pointer;
}
.fa-leftmargin {
    margin-left: 0.3rem;
}
.fa-pencil-square-o {
    margin-right: 4px;
}
</style>