<template>
<div class="wrapper">
    <!-- left menu area -->
    <div class="left-menu">
        <div class="left-header">
            <div class="header-item first" :class="{highlight: tabIndex===1}" 
                @click="activeTab(1)">
                <p>Friends</p>
            </div>
            <div class="header-item" :class="{highlight: tabIndex===2}" 
                @click="activeTab(2)">
                <p>Groups</p>
            </div>
        </div>
        <div class="left-content">
            <ul v-show="tabIndex===1" class="message-list">
                <li v-for="friend in friends" :key="friend.id" @click="gotoChat(friend._id)">
                    <div class="author">
                        <a class="avatar" target="_blank" >
                            <img :src="friend.avatar" alt="180">
                        </a>      
                        <div class="name">
                            <a class="blue-link" target="_blank" >{{ friend.name }}</a>
                        </div>
                    </div>
                </li>
            </ul>
            <ul v-show="tabIndex===2" class="message-list">
                <li class="later-hint">Open Later ~</li>
            </ul>
        </div>
        <div class="setting">
        </div>
    </div>
    <!-- search user area -->
    <div class="main-content">
        <div class="content-header">
            <autocomplete :suggestions="suggestions" v-model="selection"></autocomplete>
        </div>
        <div class="message-body">
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUser, getFriends, searchUser } from '@/helper/chatHelper'
import autocomplete from '@/components/common/AutoComplete'
import { filter, debounce } from 'underscore'
export default {
    mounted() {
        //get friends
        this.getFriendsList()
    },
	data () {
		return {
            tabIndex: 1,
            friends: [],

            selection: '',
            suggestions: []
		}
    },
    watch: {
        selection: function(val) {
            this.getSuggestions()
        }
    },
    computed: {
        ...mapGetters({
            userid: 'getID'
        })
    },
    methods: {
        activeTab(index) {
            this.tabIndex = index
        },
        gotoChat(otherId) {
            this.$router.push({ path: `/dashboard/userchat/${otherId}`})
        },
        getSuggestions() {
            const that = this
            debounce(async function() {
                const res = await searchUser({ text: that.selection })
                if(res.data.success) {
                    that.suggestions = res.data.users
                }
            }, 1500)()
        },
        async getFriendsList() {
            const that = this
            const res = await getFriends(this.userid)
            if(res.data.success) {
                for(let [index, value] of res.data.result.entries()) {
                    if(value.one._id === that.userid) {
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
            }
        }
    },
    components: {
        autocomplete
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
            li {
                padding: 5px 0 2px 20px;
                &:hover {
                    background: #eee;
                }
                .author {
                    margin-bottom: 8px;
                    font-size: 14px;
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
            }
        }
    }
}
.main-content {
    flex: 75%;
    border-top: 1px solid #eee;
    .content-header {
        align-items: center;
         -webkit-align-items: center;
        width: 215px;
        margin: 10px auto;
        border: 2px solid #ccd0d7;
        border-radius: 12px;
        height: auto;
        
    }
    .message-body {
        background: #f7f7f7;
        height: 533px;
    }
}
.later-hint {
    text-align: center;
    font-size: 15px;
    color: #bbb;
    margin-top: 30px;
}
</style>