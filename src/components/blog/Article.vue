<template>
    <div class="wrapper">
        <div class="main-content">
            <div class="article">
                <h1 class="title">{{ article.title }}</h1>
                <!-- author -->
                <div class="author">
                    <a class="avatar" @click="userPage">
                        <img :src="user.avatar" alt="avatar">
                    </a>          
                    <div class="info">
                        <span class="name"  @click="userPage"><a>{{ user.name }}</a></span>
                        <span class="tag">Author</span>
                        <!-- subscribe/unsubscribe -->
                        <a class="btn btn-disabled follow" v-if="disabled" @click="notice"><span>Subscribe</span></a>
                        <a class="btn btn-success follow" v-if="!substate && !disabled" @click="subscribe"><span>Subscribe</span></a>
                        <a class="btn btn-success follow" v-if="substate" @click="unsubscribe"><span>Unsubscribe</span></a>
                    </div>
                    <!-- todo: add edit button if its author -->
                </div>
                <!-- article stats -->
                <div class="metainfo">
                    <span class="publish-time">Edited - {{ article.update_at | moment }}</span>
                    <span class="wordage">Words {{ article.words }}</span>
                    <span class="views-count">Views {{ article.view }}</span>
                    <span class="comments-count">Comments {{ article.comment }}</span>
                    <span class="likes-count">Likes {{ likes }}</span>
                </div>

                <!-- article content -->
                <div class="article-cover">
                    <img :src="article.cover" alt="cover"/>
                </div>
                <div v-html="content" class="show-content">
                </div>

                <div class="show-foot">        
                    <div class="copyright">
                        © Copyright by {{ user.name }}
                    </div>
                    <div class="modal-wrap">
                        <a class="report-modal">report</a>
                    </div>
                </div>
            </div>

            <!-- author info -->
            <div class="follow-detail">
                <div class="info">
                    <a class="avatar" @click="userPage">
                        <img :src="user.avatar" alt="avatar">
                    </a>
                    <!--show if article is written by login user-->
                    <a class="btn btn-disabled follow" v-if="disabled" @click="notice"><span>Subscribe</span></a>          
                    <a class="btn btn-success follow" v-if="!substate && !disabled" @click="subscribe"><span>Subscribe</span></a>
                    <a class="btn btn-success follow" v-if="substate" @click="unsubscribe"><span>Unsubscribe</span></a>
                    <a class="title" @click="userPage" target="_blank">{{ user.name }}</a>
                    
                    <p>Subscribed by {{ subcount | number }}</p>
                </div>
                <div class="signature">{{ user.description }}</div>
            </div>

            <div class="meta">
                <span title="like" v-if="!likedstate" @click="addLike"><i class="fa fa-heart-o"></i> {{ likes }}</span>
                <span title="cancel like" v-if="likedstate" @click="cancelLike"><i class="fa fa-heart"></i> {{ likes }}</span>
                <span title="favorite" class="right-side" @click="addArticle"><i class="fa fa-bookmark-o"></i></span>
                <span title="comment" class="right-side">
                    <a v-scroll-to="'#commentarea'"><i class="fa fa-comment-o"></i></a>
                </span> 
            </div>
        </div>
        <!--collection box-->
        <box :display="isDisplay"
            :article="article_id" 
            @open="isDisplay = true" 
            @close="isDisplay = false">
        </box>
        <!--comment area-->
        <div id="commentarea">
            <comments :article="articleid" :author="authorid" :auth="isAuth"></comments>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import Comments from './Comments'
import Box from '@/components/common/CollectionBox'
import marked from '@/helper/marked.js'
import { getArticle, getLike, checkLike, checkSub, countSub, addLike, cancelLike, subscribe, unsubscribe } from '@/helper/articleHelper'

export default {
    created() {
        this.getLike()
        this.getDetail()
    },
	data () {
		return {
            article: {},
            article_id: '',
            user: {},
            content: '',
            likes: 0,
            liked: false,
            subscribed: false,
            subcount: 0,
            /*login user is article author*/
            isAuth: false,
            /*display collection box*/
            isDisplay: false
		}
    },
    computed: {
        ...mapGetters({
            userid: 'getID',
            login: 'getState'
        }),
        disabled: function() {
            return this.userid === this.user._id
        },
        likedstate: function() {
            return this.liked
        },
        substate: function() {
            return this.subscribed
        },
        articleid: function() {
            return this.$route.params.id
        },
        authorid: function() {
            return this.user._id
        }
    },
    filters: {
        moment: function (date) {
            return moment(date).calendar()
        },
        number: function (data) {
            if(data <= 1) {
                return data + ' person'
            } else {
                return data + ' people'
            }
        },
        comment: function (data) {
            if(data <= 1) {
                return data + ' comment'
            } else {
                return data + ' comments'
            }
        }
    },
    methods: {
        compileContent(value) {
            return marked(value)
        },
        userPage() {
            let path = this.article.author._id
            this.$router.push({ path: `/userpage/${path}` })
        },
        addArticle() {
            if(this.login) {
                this.isDisplay = !this.isDisplay
            } else {
                this.$store.dispatch('displayModal', { display: true, login: 'login' })
            }
        },
        //notice user cannot subscribe self
        notice() {
            this.$notify({
                title: 'Warning',
                type: 'warning',
                message: 'sorry, you cannot subscribe to yourself',
                position: 'top-left'
            })
        },
        async getDetail() {
            try {
                const res = await getArticle(this.$route.params.id)
                this.article = res.data
                this.article_id = res.data._id
                this.content = this.compileContent(res.data.content)
                this.user = res.data.author
                this.getSubCount()
                if(this.login) {
                    if(this.user._id == this.userid) {
                        //login user is article author
                        this.isAuth = true
                    }
                    this.getLikeState()
                    this.getSubState()
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        /*get number of likes*/
        async getLike() {
            try {
                const res = await getLike(this.$route.params.id)
                this.likes = res.data.like
                this.$http.get('/v/like/' + this.$route.params.id)
            } catch(err) {
                console.log(err.message)
            }
        },
        async getLikeState() {
            try {
                const res = await checkLike(this.$route.params.id, this.userid)
                this.liked = res.data
            } catch(err) {
                console.log(err.message)
            }
        },
        async getSubState() {
            try {
                const res = await checkSub(this.userid, this.user._id)
                this.subscribed = res.data
            } catch(err) {
                console.log(err.message)
            }
        },
        async getSubCount() {
            try {
                const res = await countSub(this.user._id)
                this.subcount = res.data.followers.length
            } catch(err) {
                console.log(err.message)
            }
        },
        async addLike() {
            try {
                if(this.login) {
                    const res = await addLike({ articleid: this.$route.params.id, userid: this.userid })
                    this.likes = res.data.like
                    this.liked = true
                } else {
                    this.$store.dispatch('displayModal', { display: true, login: 'login' })
                }
            } catch(err) {
               console.log(err.message)
            }
        },
        async cancelLike() {
            try {
                const res = await cancelLike({ articleid: this.$route.params.id, userid: this.userid })
                this.likes = res.data.like
                this.liked = false
            } catch(err) {
                console.log(err.message)
            }
        },
        async subscribe() {
            try {
                if(this.login) {
                    const res = await subscribe({ id: this.userid, author: this.user._id })
                    this.subscribed = true
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'you have subscribed to this author',
                        position: 'top-left'
                    })
                    this.getSubCount()
                } else {
                    this.$store.dispatch('displayModal', { display: true, login: 'login' })
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async unsubscribe() {
            try {
                const res = await unsubscribe({ id: this.userid, author: this.user._id })
                this.subscribed = false
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    message: 'you have unsubscribed to this author',
                    position: 'top-left'
                })
                this.getSubCount()
            } catch(err) {
                console.log(err.message)
            }
        }
    },
	components: {
        Comments,
        Box
	}
}
</script>

<style lang="scss" scoped>
.fa-bookmark-o {
    margin-top: 6px;
}
.wrapper {
    background: #fff;
    .main-content {
        margin: 0 auto;
        padding-top: 20px;
        padding-bottom: 40px;
        width: 620px;
        @media screen and (max-width: 420px) {
            width: 27em;
        }
        .article {
            margin-bottom: 30px;
            .title {
                word-break: break-word;
                margin: 20px 0;
                font-family: Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
                font-size: 34px;
                font-weight: 700;
                line-height: 1.3;
            }
            .author {
                display: flex;
                align-items: center;
                .avatar {
                    width: 42px;
                    height: 42px;
                    cursor: pointer;
                    img {
                        width: 100%;
                        height: 100%;
                        border: 1px solid #ddd;
                        box-shadow: 1px 1px 2px #ccc;
                        border-radius: 50%;
                    }
                }
                .info {
                    .name {
                        font-size: 16px;
                        cursor: pointer;
                        margin-left: 5px;
                    }
                    .tag {
                        padding: 3px 3px;
                        font-size: 12px;
                        color: #fff;
                        background: #ea6f5a;
                        font-weight: 400;
                        line-height: normal; 
                        box-shadow: 1px 1px 2px #ccc;
                    }
                    .btn-disabled {
                        border-radius: 40px;
                        border: 1px solid lightgrey !important;
                        color: lightgrey;
                    }
                    .btn-success {
                        border-radius: 40px;
                        border: 1px solid #42c02e;
                        color: #42c02e;
                        &:hover {
                            color: #fff;
                            background-color: #42c02e;
                        }
                    }
                    .follow {
                        padding: 2px 3px;
                        font-size: 12px;
                        border-color: #42c02e;
                        font-weight: 400;
                        line-height: normal;   
                    }
                }
            }
            .metainfo {
                display: flex;
                flex-wrap: wrap;
                margin: 5px 0 30px 0;
                font-size: 12px;
                color: #969696;
                span {
                    padding: 0 5px;
                }
            }
            .article-cover {
                text-align: center;
                margin-bottom: 15px;
                img {
                    box-shadow: 1px 1px 2px #ccc;
                    @media screen and (max-width: 420px) {
                        width: 27em;
                    }
                }
            }
            /*content*/
            .show-content {
                color: #2f2f2f;
                word-break: break-word;
                font-size: 16px;
                font-weight: 400;
                line-height: 1.7;
            }
            /*content bottom*/
            .show-foot {
                .copyright {
                    float: right;
                    margin-top: 5px;
                    font-size: 12px;
                    line-height: 1.7;
                    color: #9b9b9b;
                }
                .modal-wrap {
                    float: right;
                    margin-top: 5px;
                    margin-right: 20px;
                    font-size: 12px;
                    line-height: 1.7;
                    a {
                        color: #9b9b9b;
                        cursor: pointer;
                    }
                }
            }
        }
        /*follow author*/
        .follow-detail {
            padding: 20px;
            background-color: rgba(220, 220, 220, 0.1);
            border: 1px solid #e1e1e1;
            border-radius: 4px;
            font-size: 12px;
            .info {
                min-height: 47px;
                .avatar {
                    vertical-align: middle;
                    margin: 0 10px 0 0;
                    width: 48px;
                    height: 48px;
                    cursor: pointer;
                    float: left;
                    img {
                        width: 100%;
                        height: 100%;
                        border: 1px solid #ddd;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                }
                .follow {
                    float: right;
                    margin-top: 4px;
                    padding: 8px 0;
                    width: 100px;
                    font-size: 16px;
                    border-color: #42c02e;
                    font-weight: 400;
                    line-height: normal;
                    border-radius: 40px;
                    color: #fff;
                    background-color: #42c02e;
                }
                .btn-disabled {
                    border-radius: 40px;
                    border: 1px solid lightgrey;
                    color: lightgrey;
                    background: transparent;
                }
                .btn-success {
                    border-radius: 40px;
                    border: 1px solid #42c02e;
                    color: #42c02e;
                    background: transparent;
                    &:hover {
                        color: #fff;
                        background-color: #42c02e;
                    }
                }
                .title {
                    margin: 0;
                    font-size: 17px;
                    line-height: 1.8;
                    vertical-align: middle;
                }
                p {
                    margin-bottom: 0;
                    color: #969696;
                    margin: 0 0 10px;
                }
            }
            .signature {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e1e1e1;
                color: #969696;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        /*article meta data*/
        .meta {
            margin-top: 25px;
            font-size: 22px;
            font-weight: 400;
            line-height: 32px;
            vertical-align: middle;
            span {
                cursor: pointer;
                color: #8590a6;
                &:hover {
                    color: #5b5b5b;
                }
            }
            .right-side {
                float: right;
                margin-left: 25px;
            }
        }
    }
}
</style>