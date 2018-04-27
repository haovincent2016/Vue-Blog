<template>
<div>
    <div class="wrapper">
        <!--left menu-->
        <div class="left-menu">
            <div class="left-header">
                <div class="header-item first" :class="{highlight: tabIndex===1}" 
                    @click="activeTab(1)">Friends
                </div>
                <div class="header-item" :class="{highlight: tabIndex===2}" 
                    @click="activeTab(2)">Groups
                </div>
            </div>
            <div class="left-content">
                <ul v-show="tabIndex===1" class="message-list">
                    <li v-for="friend in friends" :key="friend.id" :class="{active: friend._id === `${otherId}`}" @click="gotoChat(friend._id)">
                        <div class="author">
                            <a class="avatar" target="_blank" >
                                <img :src="friend.avatar" alt="180">
                            </a>      
                            <div class="name">
                                <a target="_blank" >{{ friend.name }}</a>
                            </div>
                            <div class="indicator" v-show="unread != 0"> {{ unread }}</div>
                        </div>
                        <div class="last" v-html="convertFaces(lastMessage)">
                        </div>
                    </li>
                </ul>
                <ul v-show="tabIndex===2" class="message-list">
                </ul>
                <ul v-show="tabIndex===3" class="message-list">
                </ul>
            </div>
            <div class="setting">
            </div>
        </div>
        <!--main content-->
        <div class="main-content">
            <div class="content-header">
                <span class="back" @click="goBack()"><i class="fa fa-chevron-left"></i>back</span>
                <i class="fa fa-comments-o"></i>
                <p @click="goTop()">{{ chat_with.name }}</p>
            </div>
            <ul class="message-body">
                <li v-for="item in messages" 
                    :key="item.id" 
                    :class="{time: item.type === 'time', self: item.by === 'self', other: item.by === 'other'}">
                    <template v-if="item.by === 'self' || item.by === 'other'">
                        <div class="author">
                            <a class="avatar" target="_blank" >
                                <img :src="item.from_avatar" alt="180">
                            </a>   
                        </div>
                        <div class="message-content" v-html="convertFaces(item.content)"></div>
                    </template>
                    <template v-else>
                        <div v-html="convertFaces(item.content)"></div>
                    </template>
                </li>
            </ul>
            <textarea placeholder="enter your message now..." rows="5" v-model="content" class="input-area"></textarea> 
        </div>
    </div>
    <div class="send-message">   
        <button class="btn-send" @click="resetMessage">cancel</button>
        <button class="btn-send" @click="sendMessage">send</button>
        <!-- for faces input -->
        <el-popover
            ref="popoverfaces"
            placement="top-start"
            width="320"
            trigger="click">
            <p class="faces-title">Choose a face</p>
            <div class="faces-wrapper">
                <div class="face" v-for="(item, index) in faces" :key="item.id">
                    <img :src="'/static/faces/'+item.file" alt="gif" :data="item.code" @click="addFaces(item, index)">
                </div>
            </div>
        </el-popover>
        <el-button v-popover:popoverfaces class="btn-gif"><i class="fa fa-smile-o"></i>faces</el-button>
    </div>
    
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getMessage, sendMessage, getUser, getFriends } from '@/helper/chatHelper'
import { convertMessageTime } from '@/helper/time'
import $ from 'jquery'
export default {
    mounted() {
        this.otherId = this.$route.params.id
        this.fixLocation()
        //get friends
        this.getFriendsList()
        //this.handleUnread(this.otherId)
        this.getUserMessage(this.userId, this.otherId)
        this.updateSocket()
    },
    data() {
        return {
            scrollToBot: true,

            otherId: '',
            chat_with: {},
            messages: [], 
            lastMessage: '',
            content: '',
            //message number
            total: 0,
            //unread message number
            unread: 0,

            tabIndex: 1,
            friends: [],

            //faces
            faceContent: '',
            faces: [
                { file: '100.gif', code: '/::)', title: '微笑',reg:/\/::\)/g },
                { file: '101.gif', code: '/::~', title: '伤心',reg:/\/::~/g },
                { file: '102.gif', code: '/::B', title: '美女',reg:/\/::B/g },
                { file: '103.gif', code: '/::|', title: '发呆',reg:/\/::\|/g },
                { file: '104.gif', code: '/:8-)', title: '墨镜',reg:/\/:8-\)/g },
                { file: '105.gif', code: '/::<', title: '哭',reg:/\/::</g },
                { file: '106.gif', code: '/::$', title: '羞',reg:/\/::\$/g },
                { file: '107.gif', code: '/::X', title: '哑',reg:/\/::X/g },
                { file: '108.gif', code: '/::Z', title: '睡',reg:/\/::Z/g },
                { file: '109.gif', code: '/::\'(', title: '哭',reg:/\/::'\(/g },
                { file: '110.gif', code: '/::-|', title: '囧',reg:/\/::-\|/g },
                { file: '111.gif', code: '/::@', title: '怒',reg:/\/::@/g },
                { file: '112.gif', code: '/::P', title: '调皮',reg:/\/::P/g },
                { file: '113.gif', code: '/::D', title: '笑',reg:/\/::D/g },
                { file: '114.gif', code: '/::O', title: '惊讶',reg:/\/::O/g },
                { file: '115.gif', code: '/::(', title: '难过',reg:/\/::\(/g },
                { file: '116.gif', code: '/::+', title: '酷',reg:/\/::\+/g },
                { file: '117.gif', code: '/:--b', title: '汗',reg:/\/:--b/g },
                { file: '118.gif', code: '/::Q', title: '抓狂',reg:/\/::Q/g },
                { file: '119.gif', code: '/::T', title: '吐',reg:/\/::T/g },
                { file: '120.gif', code: '/:,@P', title: '笑',reg:/\/:,@P/g },
                { file: '121.gif', code: '/:,@-D', title: '快乐',reg:/\/:,@-D/g },
                { file: '122.gif', code: '/::d', title: '奇',reg:/\/::d/g },
                { file: '123.gif', code: '/:,@o', title: '傲' ,reg:/\/:,@o/g},
                { file: '124.gif', code: '/::g', title: '饿',reg:/\/::g/g },
                { file: '125.gif', code: '/:|-)', title: '累' ,reg:/\/:\|-\)/g},
                { file: '126.gif', code: '/::!', title: '吓',reg:/\/::!/g },
                { file: '127.gif', code: '/:,@H', title: '汗',reg:/\/:,@H/g },
                { file: '128.gif', code: '/:,@U', title: '仰笑',reg:/\/:,@U/g },
                { file: '129.gif', code: '/:,@Y', title: '吸烟',reg:/\/:,@Y/g },
                { file: '130.gif', code: '/:,@F', title: '奋斗',reg:/\/:,@F/g },
                { file: '131.gif', code: '/::><', title: '不满',reg:/\/::\>\</g }
            ]
        }
    },
    watch: {
        '$route.params.id'(newVal, oldVal) {
            this.otherId = newVal
            this.getUserMessage(this.userId, newVal)
        },
        messages(newVal, oldVal) {
            this.fixLocation()
        }
    },
    computed: {
        ...mapGetters({
            userId: 'getID',
            userAvatar: 'getAvatar'
        })
    },
    methods: {
        goBack() {
            this.$router.push({ path: '/zdashboard/chats'})
        },
        goTop() {
            $(".message-body").scrollTop(0)
        },
        fixLocation() {
            setTimeout(() => {
                $(".message-body").scrollTop($(".message-body")[0].scrollHeight)
            }, 100)
        },
        convertFaces(content) {
            let faces = this.faces
            for(let i = 0; i < faces.length; i++) {
                content = content.replace(faces[i].reg, '<img src="/static/faces/' + faces[i].file +'"  alt="face" />');
            }
            return content
        },
        addFaces(item, index) {
            this.content += item.code
        },
        resetMessage() {
            this.content = ''
        },
        async getFriendsList() {
            const that = this
            const res = await getFriends(this.userId)
            if(res.data.success) {
                for(let [index, value] of res.data.result.entries()) {
                    if(value.one._id === that.userId) {
                        that.friends.push({
                            _id: value.another._id,
                            name: value.another.name,
                            avatar: value.another.avatar
                        })
                    } else {
                        that.friends.push({
                            _id: value.one._id,
                            name: value.one.name,
                            avatar: value.one.avatar
                        })
                    }
                }
            } else {
                this.$notify({
                    title: 'Warning',
                    type: 'warning',
                    message: 'sorry, failed to get list',
                    position: 'top-left'
                })
            }
        },
        async getUserMessage(userId, otherId) {
            const res = await getMessage({ userId: userId, otherId: otherId})
            this.chat_with = res.data.user
            this.messages = []
            if(res.data.success) {
                if(res.data.message.length === 0) {
                    return
                }
                this.total = res.data.message.length
                //first time
                this.addTime(0, res.data.message[0].send_time)
                for(let [index, value] of res.data.message.entries()) {
                    index > 0 && this.addTime(1, value.send_time, res.data.message[index-1].send_time)
                    if(value.from._id === this.userId) {
                        value.by = 'self'
                    } else {
                        value.by = 'other'
                    }
                    value.from_avatar = value.from.avatar
                    this.messages.push(value)
                    if(index == res.data.message.length - 1) {
                        this.lastMessage = value.content
                    }
                }
            } else {
                this.$notify({
                    title: 'Warning',
                    type: 'warning',
                    message: 'sorry, failed to get messages',
                    position: 'top-left'
                })
            }
        },
        async sendMessage() {
            if(this.content.trim() === '') {
                return
            }
            this.sendSocket()
            //save to db
            let data = {
                userId: this.userId,
                otherId: this.otherId,
                content: this.content,
                time: Date.parse(new Date())
            }
            const res = await sendMessage(data)
            if(res.data.success) {
                res.data.message.by = 'self'
                res.data.message.from_avatar = this.userAvatar
                this.messages.push(res.data.message)
                this.total += 1
                this.lastMessage = this.content
                this.content = ''
            } else {
                this.$notify({
                    title: 'Warning',
                    type: 'warning',
                    message: 'sorry, failed to send message',
                    position: 'top-left'
                })
            }
        },
        addTime(state, currTime, oldTime='') {
            if(state) {
                const gap = 15 * 60 * 1000 //15 minutes
                if(currTime - oldTime > gap) {
                    this.messages.push({
                        type: 'time',
                        content: convertMessageTime(currTime)
                    })
                }
            } else {
                this.messages.push({
                    type: 'time',
                    content: convertMessageTime(currTime)
                })
            }
        },
        /*
        handleUnread(id) {
            this.$store.commit('UPDATE_UNREAD', id)
            //get unread number
            let unread = 0
            this.allMessage.forEach(item=>{
                if(!item.is_read) {
                    unread += 1
                }
            })
            this.unread = unread
        },
        */
        updateSocket() {
            socket.removeAllListeners()
            socket.on('receiveUserMessage', (data) => {
                if(data.from === this.userId) {
                    return
                }
                if(this.otherId === data.from) {
                    data.by = 'other'
                    this.messages.push(data)
                    this.unread += 1
                }
            })
        },
        sendSocket() {
            socket.emit('sendUserMessage', {
                from: this.userId,
                to: this.otherId,
                content: this.content,
                send_time: Date.parse(new Date()),
                from_avatar: this.userAvatar,
                is_read: false
            })
            this.unread = 0
        },

        activeTab(index) {
            this.tabIndex = index
        },
        gotoChat(otherId) {
            this.$router.push({ path: `/zdashboard/userchat/${otherId}`})
        }
    },
    components: {
        scroll
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    @media screen and (max-width: 420px) {
        flex-direction: column;
    }
}
.left-menu {
    flex: 25%;
    border-top: 1px solid #eee; 
    border-right: 1px solid #eee;
    .left-header {
        border-bottom:1px solid #eee;
        height:52px;
        line-height:52px;
        padding:0px 20px;
        background:#fff;
        display:flex;
        color:#969696;
        font-size:15px;
        .header-item{
            cursor: pointer;
            margin-left: 25px;
            &.first{
            margin-left:0;
            }
            &.highlight{
            border-bottom:2px solid #00a1d6;
            color:#00a1d6;
            }
        }
    }
    .left-content {
        .message-list {
            .active {
                background: #f7f7f7;
            }
            li {
                padding: 5px 0 2px 20px;
                &:hover {
                    background: #eee;
                }
                .author {
                    margin-bottom: 8px;
                    font-size: 14px;
                    .indicator {
                        float: right;
                        padding: 2px 6px;
                        background: #fff;
                        color: #00a1d6;
                        border: 1px solid #00a1d6;
                        border-radius: 50%;
                        margin: 7px;
                    }
                    .name {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .avatar {
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 5px 0 0;
                        width: 32px;
                        height: 32px;
                        cursor: pointer;
                        img {
                            width: 100%;
                            height: 100%;
                            border: 1px solid #ddd;
                            border-radius: 50%;
                            vertical-align: middle;
                        }
                    }
                }
                .last {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 185px;
                    background: #fff;
                    padding: 8px;
                    border-radius: 14px;
                    margin-bottom: 7px;
                }
            }
        }
    }
}
.main-content {
    flex: 75%;
    border-top: 1px solid #eee;
    .content-header {
        align-items: center;
        height: 34px;
        padding-top: 19px;
        text-align: center;
        padding-right: 62px;
        .back {
            float: left;
            font-size: 15px;
            padding: 0 4px;
            margin-left: 12px;
            cursor: pointer;
            color: #969696;
            .fa {
                font-size: 13px;
                font-weight: 400;
                margin-right: 4px;
            }
            &:hover {
                color: #333;
            }
        }
        p {
            display: inline-block;
            font-size: 15px;
            color: #969696;
            cursor: pointer;
        }
        .fa {
            font-size: 15px;
            color: #969696;
        }
    }
    .message-body {
        background: #f7f7f7;
        height: 394px;
        overflow-y: auto;
        .time {
            height: 35px;
            line-height: 35px;
            font-size: 13px;
            color: #666;
            text-align: center;
        }
        .self {
            height: auto;
            min-height: 40px;
            padding: 8px 10px;
            .author {
                float: left;
                margin-bottom: 8px;
                font-size: 14px;
                .avatar {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 5px 2px 0;
                    width: 34px;
                    height: 34px;
                    cursor: pointer;
                    img {
                        width: 100%;
                        height: 100%;
                        border: 1px solid #ddd;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                }
            }
            .message-content {
                font-size: 12px;
                margin-left: 10px;
                background: #fff;
                color: #000;
                height: auto;
                width: auto;
                max-width: 230px;
                display: inline-block;
                border-radius: 10px;
                padding: 6px 10px;
            }
        }
        .other {
            height: auto;
            min-height: 40px;
            padding: 8px 10px;
            .author {
                float: right;
                margin-bottom: 8px;
                font-size: 14px;
                .avatar {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 5px 2px 0;
                    width: 34px;
                    height: 34px;
                    cursor: pointer;
                    img {
                        width: 100%;
                        height: 100%;
                        border: 1px solid #ddd;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                }
            }
            .message-content {
                float: right;
                font-size: 12px;
                margin-right: 10px;
                background: #fff;
                color: #000;
                height: auto;
                line-height: 23px;
                width: auto;
                max-width: 230px;
                border-radius: 10px;
                padding: 6px 10px;
            }
        }
    }
    .input-area {
        width: 98%;
        border: none;
        padding: 8px;
        resize: none;
        outline: none;
    }
}
.send-message {
    height: 28px;
    .btn-send {
        float: right;
        margin: 0 8px 10px 0;
        font-size: 14px;
        padding: 3px 8px;
        color: #ea6f5a;
        border: 1px solid #ea6f5a;
        border-radius: 5px;
        background: none;
        outline: none;
        cursor: pointer;
        &:hover {
            background: #ea6f5a;
            color: #fff;
        }
    }
    .btn-gif {
        float: right;
        margin: 0 8px 10px 0;
        font-size: 14px;
        padding: 3px 8px;
        color: grey;
        border: 1px solid grey;
        border-radius: 5px;
        background: none;
        outline: none;
        cursor: pointer;
        &:hover {
            background: grey;
            color: #fff;
        }
        .fa {
            margin-right: 3px;
        } 
    }
}
.faces-title {
    text-align: center;
}
.faces-wrapper {
    display: flex;
    flex-wrap: wrap;
    .face {

    }
}
</style>