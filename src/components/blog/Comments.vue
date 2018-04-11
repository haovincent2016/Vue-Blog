<template>
<div class="post">
<div id="comment-list" class="comment-list">
    <!--post new comment after login-->
    <div v-if="isLogin && opencomments" class="new-comment">
        <a class="avatar">
            <img :src="userpic">
        </a> 
        <textarea 
            @focus="operation = true" 
            v-model="content" 
            placeholder="Please write down your comments...">
        </textarea>
        <div v-show="operation" class="write-function-block">
            <a class="btn btn-send" @click="writeComment()">Post</a> 
            <a class="cancel" @click="cancelComment()">Cancel</a>
        </div> 
    </div>
    <!--require login before posting comment-->
    <div v-if="!isLogin && opencomments" class="require-auth">
        <div class="auth-container">
            <a @click="openLogin()" class="btn btn-login">Login</a>
        </div>
    </div>
    <div v-if="!opencomments" class="require-auth">
        <div class="auth-container">
            <span><i class="fa fa-ban"></i>Sorry, you can't comment now</span>
        </div>
    </div>   
    <div id="normal-comment-list" class="normal-comment-list">
        <div>
            <div>
                <div class="top">
                    <span>{{ number }} comments</span> 
                    <a v-show="sortAuthorState==false" class="author-only" @click="sortAuthor()">Author comments</a>
                    <a v-show="sortAuthorState==true" class="author-only" @click="sortAuthor()">Show all</a>
                    <!--only visible to author--> 
                    <a class="close-btn" v-if="auth && opencomments" @click="closeComments(true)">Close comments</a>
                    <a class="close-btn" v-if="auth && !opencomments" @click="closeComments(false)">Open comments</a>  
                    <div class="pull-right">
                        <a class="sort" :class="{ active: isLike }" @click="sortState('likes')">Sort by likes</a>
                        <a class="sort" :class="{ active: isPos }" @click="sortState('positive')">Sort by newest</a>
                        <a class="sort" :class="{ active: isNeg }" @click="sortState('negative')">Sort by oldest</a>
                    </div>
                </div>
            </div>
            
            <!--primary comment--> 
            <div class="comment" v-if="opencomments" v-for="(comment, index) in comments" :key="comment.id">
                <div class="author">
                    <a href="" target="_blank" class="avatar">
                    <img :src="comment.post_by.avatar">
                    </a> 
                    <div class="info">
                        <a href="" target="_blank" class="name">{{ comment.post_by.name }}</a>
                        <div class="meta"><span>level {{ index + 1 }} · {{ comment.post_date | moment }}</span></div>
                    </div>
                </div> 
                <p>{{ comment.content }}</p>
                <!--sub comment -->
                <subcomments :primary="comment" :articleid="article" :primaryindex="index"></subcomments>
                <div v-show="showInput && selectedSub === index" class="new-comment" style="margin-left:0">
                    <textarea  
                        v-model="subcontent" 
                        :placeholder="`Reply ${comment.post_by.name}`">
                    </textarea>
                    <div class="write-function-block">
                        <a class="btn btn-send" @click="writeSub(comment)">Post</a> 
                        <a class="cancel" @click="cancelSub(comment)">Cancel</a>
                    </div> 
                </div> 
            </div>
            <div class="banned" v-if="!opencomments">
                <span><i class="fa fa-ban"></i>Article author has disabled comments</span>
            </div>   
        </div>
    </div>
</div>
</div>
</template>

<script>
import  { mapGetters } from 'vuex'
import moment from 'moment'
import { checkComments } from '@/helper/articleHelper'
import * as helper from '@/helper/commentHelper'
import subcomments from './Subcomments'

export default {
    mounted() {
        this.getComments()
        this.checkArticleComments()
        this.getNumber()
    },
    props: [
        'article',
        'author',
        'auth'
    ],
	data () {
		return {
            comments: [],
            /* primary comment content */
            content: '',
            sort: 'positive',
            number: 0,
            likestate: '',
            selectedSub: -1,
            subcontent: '',
            subid: '',
            /* reply to */
            reply_to: '',
            /*show post operation*/
            sortAuthorState: false,
            operation: false,
            isLike: false,
            isPos: false,
            isNeg: false,
            showInput: false,
            /* check if comments close */
            opencomments: true
		}
    },
    filters: {
        moment: function (date) {
            return moment(date).calendar()
        }
    },
    computed: {
        ...mapGetters({
            isLogin: 'getState',
            userid: 'getID',
            userpic: 'getAvatar'
        })
    },
    methods: {
        openLogin() {
            this.$store.dispatch('displayModal', { display: true, login: 'login' })
        },
        async getNumber() {
            try {
                const res = await helper.getCommentsNumber(this.article)
                this.number = res.data
            } catch(err) {
                console.log('error occurs')
            }
        },
        sortState(val) {
            if(val === 'likes') {
                this.sort = 'likes'
                this.isLike = true,
                this.isNeg = false,
                this.isPos = false,
                this.getComments()
            } else if (val === 'negative') {
                this.sort = 'negative'
                this.isNeg = true,
                this.isPos = false,
                this.isLike = false,
                this.getComments()
            } else {
                this.sort = 'positive'
                this.isPos = true,
                this.isNeg = false,
                this.isLike = false,
                this.getComments()
            }
        },
        async sortAuthor() {
            if(this.sortAuthorState === false) {
                try {
                    const res = await helper.getAuthorComments(this.article, this.author)
                    if(res.data.success) {
                        this.comments = res.data.comments
                        this.sortAuthorState = true
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'failed to get author comments',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log(err.message)
                }
            } else {
                this.sortState(this.sort)
                this.sortAuthorState = false
            }
        },
        replyPrimary(index) {
            this.showInput = true
            this.selectedSub = index
        },
        async getComments() {
            try {
                const res = await helper.getComments(this.article, this.sort)
                if(res.data.success) {
                    let filtered = res.data.comments.filter(function(comment) {
                        return comment.first
                    })
                    this.comments = filtered
                } else {
                    return
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async writeComment() {
            try {
                const res = await helper.postComment(this.article, this.content, this.userid)
                if(res.data.success) {
                    this.content = ''
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: res.data.message,
                        position: 'top-left'
                    })
                    this.getComments()
                    this.getNumber()
                    this.updateArticle() 
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                }
            } catch(err) {
               console.log(err.message) 
            }
        },
        async updateArticle() {
            try {
                const res = await helper.updateRecord(this.article, true)
                if(res.data.success) {
                    this.number = res.data.comment
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async addtoComment(comment) {
            try {
                const res = await helper.addToComment(comment._id, this.subid)
                if(res.data.success) {
                    return
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'comment not properly saved',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        cancelComment() {
            this.content = '',
            this.operation = false
        },
        async writeSub(comment) {
            const that = this
            try {
                const res = await helper.postSubcomment(this.article, this.subcontent, this.userid, comment.post_by._id)
                if(res.data.success) {
                    this.subcontent = ''
                    this.showInput = false
                    this.selectedSub = -1
                    this.subid = res.data.newSub._id
                    const sub = await helper.getComment(this.subid)
                    if(sub.data.success) {
                        that.comments.push(sub.data.comment)
                    }
                    this.addtoComment(comment)
                    this.updateArticle()
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        cancelSub(comment) {
            this.subcontent = ''
            this.showInput = false
            this.selectedSub = -1
        },
        commentDetail(comment) {
            this.comment_id =comment._id
            this.$router.push('/m/comment/' + this.comment_id)
        },
        /* close article comments area, only by author */
        async closeComments(state) {
            if(state) {
                try {
                    const res = await helper.closeComment(this.article, true)
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'comments closed',
                            position: 'top-left'
                        })
                        this.opencomments = false
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'failed to close comments',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log(err.message)
                }
            } else {
                try {
                    const res = await helper.closeComment(this.article, false)
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'comments closed',
                            position: 'top-left'
                        })
                        this.opencomments = true
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'failed to close comments',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log(err.message)
                }
            }
        },
        async checkArticleComments() {
            try {
                const res = await checkComments({ articleid: this.article })
                if(res.data.success) {
                    this.opencomments = false
                } else {
                    this.opencomments = true
                }
            } catch(err) {
                console.log(err.message)
            }
        }
    },
	components: {
		subcomments
	}
}
</script>

<style lang="scss" scoped>
.post {
    margin: 0 auto;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 620px;
    @media screen and (max-width: 420px) {
        width: 23em;
    }
}
.comment-list {
    padding-top: 100px;
    .require-auth {
        position: relative;
        .auth-container {
            padding-top: 18px;
            width: 100%;
            height: 80px;
            font-size: 13px;
            border: 1px solid #dcdcdc;
            border-radius: 4px;
            background-color: hsla(0,0%,71%,.1);
            resize: none;
            display: inline-block;
            vertical-align: top;
            outline-style: none;
            text-align: center;
            .btn-login {
                width: 78px;
                margin: 11px 10px 0 0;
                padding: 7px 18px;
                font-size: 16px;
                border: 1px solid #00a1d6;
                border-radius: 20px;
                color: #00a1d6;
                outline: none;
                &:hover {
                    color: #fff;
                    background-color: #00a1d6;
                }
            }
            span {
                font-size: 14px;
                vertical-align: -22px;
                color: grey;
                i {
                    margin-right: 8px;
                }
            }
        }
    }
    .new-comment {
        position: relative;
        margin-left: 48px;
        .avatar {
            position: absolute;
            left: -48px;
            margin-right: 5px;
            width: 38px;
            height: 38px;
            vertical-align: middle;
            display: inline-block;
            img {
                width: 100%;
                height: 100%;
                border: 1px solid #ddd;
                border-radius: 50%;
                vertical-align: middle;
            }
        }
        textarea {
            padding: 10px 15px;
            width: 95%;
            height: 80px;
            font-size: 13px;
            border: 1px solid #dcdcdc;
            border-radius: 4px;
            background-color: rgba(220, 220, 220, 0.1);
            resize: none;
            display: inline-block;
            vertical-align: top;
            outline-style: none;
        }
        .write-function-block {
            height: 50px;
            .emoji-modal-wrap[data-v-b36e9416] {
                position: relative;
                .emoji {
                    float: left;
                    margin-top: 14px;
                }
            } 
            .btn-send {
                float: right;
                width: 78px;
                margin: 10px 0;
                padding: 6px 0;
                font-size: 16px;
                border: none;
                border-radius: 20px;
                color: #fff!important;
                background-color: #ea6f5a;
                cursor: pointer;
                outline: none;
                display: block;
            }
            .cancel {
                float: right;
                margin: 18px 30px 0 0;
                font-size: 16px;
                color: #969696;
                cursor: pointer;
            }   
        }
    }
    .normal-comment-list {
        margin-top: 30px;
    }
}
.top {
    padding-bottom: 20px;
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;
    @media screen and (max-width: 420px) {
        height: 40px;
    }
    span {
        @media screen and (max-width: 420px) {
            display: none;
        }
    }
    .author-only {
        margin-left: 10px;
        padding: 4px 8px;
        font-size: 12px;
        color: #969696;
        border: 1px solid #e1e1e1;
        border-radius: 12px;
        &:hover {
            color: #fff;
            background: #00a1d6;
            border: 1px solid #00a1d6;
        }
    }
    .close-btn {
        margin-left: 10px;
        padding: 4px 8px;
        font-size: 12px;
        color: #969696;
        border: 1px solid #e1e1e1;
        border-radius: 12px;
        &:hover {
            color: #fff;
            background: #ea6f5a;
            border: 1px solid #ea6f5a;
        }
    }
    .pull-right {
        float: right;
        margin-left: 10px;
        font-size: 12px;
        font-weight: 400;
        color: #969696;
        cursor: pointer;
        @media screen and (max-width: 420px) {
            float: left;
            margin-top: 17px;
        }
        .active {
            border: 1px solid #00a1d6;
            padding: 5px;
            background: #00a1d6;
            color: #fff;
            border-radius: 10px;
        }
        .sort {
            padding: 5px;
        }
    }
}
/*primary comment*/
.comment {
    padding: 20px 0 10px;
    .author {
        margin-bottom: 10px;
        .avatar {
            margin-right: 5px;
            width: 38px;
            height: 38px;
            vertical-align: middle;
            display: inline-block;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
                border: 1px solid #ddd;
                border-radius: 50%;
                vertical-align: middle;
            }
        }
        .info {
            display: inline-block;
            vertical-align: middle;
            .name {
                font-size: 15px;
                color: #333;
            }
            .meta {
                font-size: 12px;
                color: #969696;
                span {
                    margin-right: 6px;
                }
            }
        }
    }
    .comment-wrap {
        p {
            margin: 0 0 5px;
            font-size: 14px;
            line-height: 1.5;
        }
    }
}
.new-comment {
    position: relative;
    margin-top: 30px;
    margin-left: 48px;
    .avatar {
        position: absolute;
        left: -48px;
        margin-right: 5px;
        width: 38px;
        height: 38px;
        vertical-align: middle;
        display: inline-block;
        img {
            width: 100%;
            height: 100%;
            border: 1px solid #ddd;
            border-radius: 50%;
            vertical-align: middle;
        }
    }
    textarea {
        padding: 10px 15px;
        width: 90%;
        height: 80px;
        font-size: 13px;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        background-color: rgba(220, 220, 220, 0.1);
        resize: none;
        display: inline-block;
        vertical-align: top;
        outline-style: none;
    }
    .write-function-block {
        height: 50px;
        .btn-send {
            float: right;
            width: 78px;
            margin: 10px 0;
            padding: 6px 0;
            font-size: 16px;
            border: none;
            border-radius: 20px;
            color: #fff!important;
            background-color: #ea6f5a;
            cursor: pointer;
            outline: none;
            display: block;
        }
        .cancel {
            float: right;
            margin: 18px 30px 0 0;
            font-size: 16px;
            color: #969696;
            cursor: pointer;
        }   
    }
}
.banned {
    padding: 20px;
    text-align: center;
    font-size: 15px;
    margin-top: 25px;
    span {
        color: grey;
        i {
            margin-right: 8px;
        }
    }
}
</style>