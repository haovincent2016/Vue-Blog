<template>
<div>
    <!--primary comment options-->
    <div class="comment-wrap">
        <div class="tool-group">
            <a class="" @click="toggleLike(primary, index)">
                <i class="fa fa-thumbs-o-up"></i> 
                <span>{{ primary.likes | like }}</span>
            </a>
            <a v-if="isLogin" @click="showSub(primary, index)" class="">
                <i class="fa fa-reply"></i> 
                <span>Reply</span>
            </a>
            <a v-if="!isLogin" @click="openLogin()">
                <i class="fa fa-reply"></i> 
                <span>Reply</span>
            </a>
            <a class="report">
                <i class="fa fa-exclamation-circle"></i>
                <span>Report</span>
            </a> 
        </div>
    </div>
    <div class="sub-comment-list">
        <!--first 3 subcomments-->
        <div v-for="(comment, index) in sub(primary)" :key="comment.id" class="sub-comment">
            <p>
                <a href="" target="_blank">{{ comment.post_by.name }}</a>
                <span>reply to <a href="" target="_blank">{{ comment.reply_to.name }}</a> : {{ comment.content }}</span>
            </p> 
            <div class="sub-tool-group">
                <span>{{ comment.post_date | moment }}</span> 
                <a v-if="isLogin" @click="showSub(comment, index)" class="">
                    <i class="fa fa-reply"></i> 
                    <span>Reply</span>
                </a>
                <!--if user not login-->
                <a v-if="!isLogin" @click="openLogin()">
                    <i class="fa fa-reply"></i> 
                    <span>Reply</span>
                </a> 
                <a class="report">
                    <i class="fa fa-exclamation-circle"></i>
                    <span>Report</span>
                </a>
            </div>
        </div>
        <!--the rest subcomments-->
        <div v-show="viewmore === false" v-for="(more, index) in restsub(primary)" :key="more.id" class="sub-comment">
            <p>
                <a href="" target="_blank">{{ more.post_by.name }}</a>
                <span>reply to <a href="" target="_blank">{{ more.reply_to.name }}</a> : {{ more.content }}</span>
            </p> 
            <div class="sub-tool-group">
                <span>{{ more.post_date | moment }}</span> 
                <a v-if="isLogin" @click="showSub(more, index+3)" class="">
                    <i class="fa fa-reply"></i> 
                    <span>Reply</span>
                </a>
                <!--if user not login-->
                <a v-if="!isLogin" @click="openLogin()">
                    <i class="fa fa-reply"></i> 
                    <span>Reply</span>
                </a>
                <a class="report">
                    <i class="fa fa-exclamation-circle"></i>
                    <span>Report</span>
                </a>
            </div>
        </div>
        <!--show more subcomments-->
        <div v-show="viewmore === true && isShown === true" v-on:click="viewmore=false" class="sub-commet show-more">
            <i class="fa fa-chevron-down"></i>
            <a>View More</a>
        </div> 
        <div v-show="viewmore === false && isShown === true" v-on:click="viewmore=true" class="sub-commet show-more">
            <i class="fa fa-chevron-up"></i>
            <a>Show Less</a>
        </div>
        
        <div v-show="showInput" class="new-comment" style="margin-left:0">
            <textarea  
                v-model="subcomment" 
                :placeholder="`Reply ${reply_to.name}`">
            </textarea>
            <div class="write-function-block">
                <a class="btn btn-send" @click="writeSub()">Post</a> 
                <a class="cancel" @click="cancelSub()">Cancel</a>
            </div> 
        </div> 
    </div>
</div>
</template>
<script>
import  { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            viewmore: true,
            isShown: false,
            showInput: false,
            subcomments: [],
            current_primary: {},
            reply_to: {},
            selectedSub: -1,
            subcomment: '',
            count: 0,

            likestate: '',
            liked: false
        }
    },
    props: [
        'primary',
        'articleid',
        'primaryindex'
    ],
    computed: {
        ...mapGetters({
            isLogin: 'getState',
            userid: 'getID',
            userpic: 'getCover'
        })
    },
    filters: {
        moment: function (date) {
            return moment(date).calendar()
        },
        like: function(data) {
            if(data === 0) {
                return 'Like'
            } else if (data === 1) {
                return data + ' Like'
            } else {
                return data + ' Likes'
            }
        }
    },
    methods: {
        openLogin() {
            this.$store.dispatch('displayModal', { display: true, login: 'login' })
        },
        async toggleLike(comment, index) {
            if(this.likestate == index && this.liked == false) {
                try {
                    const addlike = await this.$http.post('/m/addlike', { comment: comment._id })
                    comment.likes = addlike.data.likes
                    this.liked = true
                } catch(err) {
                    console.log(err)
                } 
            } else if(this.likestate == index && this.liked == true) {
                try {
                    const cancellike = await this.$http.post('/m/cancellike', { comment: comment._id })
                    comment.likes = cancellike.data.likes
                    this.liked = false
                } catch(err) {
                    console.log(err)
                }
            } else {
                this.likestate = index
                try {
                    const addlike = await this.$http.post('/m/addlike', { comment: comment._id })
                    comment.likes = addlike.data.likes
                    this.liked = true
                } catch(err) {
                    console.log(err)
                } 
            }
        },
        sub(comment) {
            this.subcomments = comment.subcomments
            //console.log(this.subcomments.slice(0,3))
            return comment.subcomments.slice(0,3)
        },
        restsub(comment) {
            if(comment.subcomments.length > 3) {
                this.isShown = true
                //console.log(this.subcomments.slice(3))
                return comment.subcomments.slice(3)
            } else {
                this.isShown = false
            }
        },
        showSub(comment, subindex) {
            this.current_primary = comment
            this.reply_to = comment.post_by
            /*
            if(this.selectedSub != subindex) {
                this.selectedSub = subindex
            } else {
                this.selectedSub = -1
            }
            */
            this.showInput = true
        },
        cancelSub() {
            this.subcomment = ''
            /*this.selectedSub = -1*/
            this.showInput = false
        },
        writeSub() {
            const that = this
            this.$http.post('/m/subcomment', { articleid: this.articleid, content: this.subcomment, author: this.userid, reply: this.reply_to._id })
                .then(res => {
                    if(res.data.success) {
                        this.subcomment = ''
                        this.showInput = false
                        this.subid = res.data.new._id
                        this.$http.get('/m/comment/' + this.subid)
                            .then(res => {
                                that.subcomments.push(res.data)
                            })
                        this.addtoComment(this.current_primary, this.subid)
                        this.updateArticle()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        addtoComment(comment, subid) {
            this.$http.post('/m/addtocomment', { comment: comment._id, subid: subid })
                .then(res => {
                    //console.log(res.data.success)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        updateArticle() {
            this.$http.post('/m/article',  { articleid: this.articleid, add: true })
                .then(res => {
                    this.number = res.data.comment
                })
                .catch(err => {
                    console.log(err)
                })
        },
    }
}
</script>
<style lang="scss" scoped>
.comment-wrap {
    .tool-group {
        padding: 5px 0;
        a {
            margin-right: 10px;
            font-size: 14px;
            color: #969696;
            display: inline-block;
        }
    }
}
.sub-comment-list {
    overflow-y: auto;
    margin-top: 10px;
    padding-left: 20px;
    border-left: 2px solid #d9d9d9;
    .sub-comment {
        padding: 8px 0;
        border-bottom: 1px dashed #f0f0f0;
        p {
            margin: 0 0 5px;
            font-size: 14px;
            line-height: 1.5;
            a {
                color: #00a1d6;
            }
            span {
                a {
                    color: #00a1d6;
                }
            }
        }
        .sub-tool-group {
            font-size: 12px;
            color: #969696;
            a {
                margin-left: 10px;
                color: #969696;
            }
        }
    }
    .sub-comment:last-child {
        margin: 0;
        padding: 0;
        border: none;
    }
    .show-more {
        color: #00a1d6;
        font-size: 13px;
        margin: 8px 0;
    }
    .more-comment {
        margin-top: 10px;
        font-size: 14px;
        color: #969696;
        border: none;
        .add-comment-btn {
            color: #969696;
            i {
                margin-right: 5px;
            }
        }
    }
}  
.new-comment {
    position: relative;
    margin-top: 16px;
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
        width: 95%;
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
</style>