<template>
<div>
    <!--primary comment options-->
    <div class="comment-wrap">
        <div class="tool-group">
            <a :class="{highlight: liked}" @click="toggleLike(primary)">
                <i class="fa fa-thumbs-o-up"></i> 
                <span>{{ primary.likes | like }}</span>
            </a>
            <a v-if="isLogin" @click="showSub(primary)" class="">
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
        <div v-for="comment in sub(primary)" :key="comment.id" class="sub-comment">
            <p>
                <a class="user-link" @click="userPage(comment, true)" target="_blank">{{ comment.post_by.name }}</a>
                <span>reply to <a class="user-link" @click="userPage(comment, false)" target="_blank">{{ comment.reply_to.name }}</a> : {{ comment.content }}</span>
            </p> 
            <div class="sub-tool-group">
                <span>{{ comment.post_date | moment }}</span> 
                <a v-if="isLogin" @click="showSub(comment)" class="">
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
        <div v-show="viewmore === false" v-for="more in restsub(primary)" :key="more.id" class="sub-comment">
            <p>
                <a class="user-link" @click="userPage(comment, true)" target="_blank">{{ more.post_by.name }}</a>
                <span>reply to <a class="user-link" @click="userPage(comment, false)" target="_blank">{{ more.reply_to.name }}</a> : {{ more.content }}</span>
            </p> 
            <div class="sub-tool-group">
                <span>{{ more.post_date | moment }}</span> 
                <a v-if="isLogin" @click="showSub(more)" class="">
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
import * as helper from '@/helper/commentHelper'
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
            userpic: 'getAvatar'
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
        //navigate user page
        userPage(comment, post) {
            if(post) {
                let path = comment.post_by._id
                this.$router.push({ path: `/userpage/${path}` })
            } else {
                let path = comment.reply_to._id
                this.$router.push({ path: `/userpage/${path}` })
            }
        },
        //open login modal
        openLogin() {
            this.$store.dispatch('displayModal', { display: true, login: 'login' })
        },
        //like or unlike a comment
        async toggleLike(comment) {
            if(this.liked == false) {
                try {
                    const addlike = await helper.addLike(comment._id)
                    comment.likes = addlike.data.likes
                    this.liked = true
                } catch(err) {
                    console.log(err.message)
                } 
            } else {
                try {
                    const cancellike = await helper.cancelLike(comment._id)
                    comment.likes = cancellike.data.likes
                    this.liked = false
                } catch(err) {
                    console.log(err.message)
                }
            } 
        },
        //get first 3 subcomments of primary comment
        sub(comment) {
            this.subcomments = comment.subcomments
            return comment.subcomments.slice(0,3)
        },
        //get rest subcomments of primary comment
        restsub(comment) {
            if(comment.subcomments.length > 3) {
                this.isShown = true
                return comment.subcomments.slice(3)
            } else {
                this.isShown = false
            }
        },
        //show comment input when reply
        showSub(comment) {
            this.current_primary = comment
            this.reply_to = comment.post_by
            this.showInput = true
        },
        //close comment input
        cancelSub() {
            this.subcomment = ''
            this.showInput = false
        },
        async writeSub() {
            const that = this
            try { 
                const res = await helper.postSubcomment(this.articleid, this.subcomment, this.userid, this.reply_to._id)
                if(res.data.success) {
                    this.subcontent = ''
                    this.showInput = false
                    this.subid = res.data.newSub._id
                    const sub = await helper.getComment(this.subid)
                    if(sub.data.success) {
                        that.subcomments.push(sub.data.comment)
                    }
                    this.addtoComment(this.current_primary, this.subid)
                    this.updateArticle()
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async addtoComment(comment, subid) {
            try {
                const res = await helper.addToComment(comment._id, subid)
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
        async updateArticle() {
            try {
                const res = await helper.updateRecord(this.article, true)
                if(res.data.success) {
                    this.number = res.data.comment
                }
            } catch(err) {
                console.log(err.message)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.comment-wrap {
    .tool-group {
        padding-top: 8px;
        a {
            margin-right: 10px;
            font-size: 14px;
            color: #969696;
            display: inline-block;
            &:hover {
                color: #13b9ef;
            }
        }
        .highlight {
            color: #13b9ef;
        }
    }
}
.sub-comment-list {
    overflow-y: auto;
    margin-top: 10px;
    padding-left: 10px;
    border-left: 1px solid #d9d9d9;
    .sub-comment {
        padding: 8px 0;
        border-bottom: 1px dashed #f0f0f0;
        p {
            margin: 0 0 5px;
            font-size: 14px;
            line-height: 1.5;
            a {
                color: #13b9ef;
                &:hover {
                  color: #00a1d6;  
                }
            }
            span {
                a {
                    color: #13b9ef;
                    &:hover {
                    color: #00a1d6;  
                    }
                }
            }
        }
        .sub-tool-group {
            font-size: 12px;
            color: #969696;
            a {
                margin-left: 10px;
                color: #969696;
                &:hover {
                    color: #00a1d6;  
                }
            }
        }
    }
    .sub-comment:last-child {
        margin: 0;
        padding: 0;
        border: none;
    }
    .show-more {
        width: 82px;
        color: #00a1d6;
        font-size: 13px;
        margin: 8px 0;
        &:hover {
            background: lightgrey;
            padding: 1px;
            width: 82px;
            border-radius: 6px;
        }
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
            background-color: #00a1d6;
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