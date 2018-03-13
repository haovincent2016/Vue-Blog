<template>
    <div>
        <input class="form-control" type="text" 
            :value="value" 
            @input="updateInput($event.target.value)"
            @keydown.enter = 'enter'
            @keydown.down = 'down'
            @keydown.up = 'up'
            placeholder="enter user email"
        >
        <i class="fa fa-search"></i>
        <ul v-if="openSuggestion" class="dropdown-menu">
            <li v-for="(suggestion, index) in matches"
                :key="suggestion.id"
                :class="{'active': isActive(index)}"
                @click="clickSuggestion(index)"
            >
                <div class="author">
                    <a class="avatar">
                        <img :src="suggestion.avatar" alt="180">
                    </a>      
                    <div class="name">
                        <a class="blue-link">name: {{ suggestion.name }}<br />{{ suggestion.email }}</a>
                    </div>
                </div>
            </li>
        </ul>
        <!--search user and apply friend -->
        <div v-if="showRequest || isRejected" class="info">
            <div class="user">
                {{ userInfo.name }}
            </div>
            <button class="btn-apply" @click="applyFriend()"><i class="fa fa-plus"></i>apply friends</button>
        </div>
        <!--show info if sent request -->
        <div v-if="isFriends" class="info">
            <p class="friends-info">you two are already friends</p>
        </div>
        <div v-if="isPending" class="info">
            <p class="friends-info">you have sent friend request, waiting response</p>
        </div>
        <!--received friend request-->
        <ul v-if="hasRequest" class="info">
            <li v-for="request in requests" :key="request.id">
                <div class="user">
                    {{ request.from }}
                </div>
                <div class="time">
                    {{ request.send_time }}
                </div>
                <button class="btn-apply" @click="acceptFriend(request)"><i class="fa fa-plus"></i>accept</button>
                <button class="btn-apply" @click="rejectFriend(request)"><i class="fa fa-plus"></i>dismiss</button>
            </li>
        </ul>
        <div v-if="!showRequest || !hasRequest" class="bg">
        </div>
    </div>
</template>

<script>
import { getUser } from '@/helper/userHelper'
import { mapGetters } from 'vuex'
import { sendFriendRequest, getFriendRequests, acceptFriendRequest, rejectFriendRequest, checkRequest } from '@/helper/userHelper'
export default {
    mounted() {
        this.getRequests()
        this.updateSocket()
    },
	data () {
		return {
            isOpen: false,
            currIndex: 0,
            userInfo: {},
            
            //show searched user and application field
            showRequest: false,
            //show friend requests from others
            hasRequest: false,
            requests: [],

            isFriends: false,
            isRejected: false,
            isPending: false
		}
    },
    props: {
        value: {
            type: String,
            required: true
        },
        suggestions: {
            type: Array,
            required: true
        }

    },
    computed: {
        ...mapGetters([
            'getID'
        ]),
        // Filtering the suggestion based on the input
        matches () {
            if(this.value !== '') {
                const matches = this.suggestions.filter((obj) => {
                    return obj.name.indexOf(this.value) !== -1
                })
                return matches
            } else {
                return []
            }
        },
        openSuggestion () {
            return this.selection !== '' && this.matches.length !== 0 && this.isOpen === true
        }
  
    },
    methods: {
        // parent component
        updateInput (value) {
            if (this.isOpen === false) {
                this.isOpen = true
                this.currIndex = 0
            }
            if( value === '') {
                this.showRequest = false
            }
            this.$emit('input', value)
        },

        // When enter key pressed on the input
        enter () {
            this.$emit('input', this.matches[this.currIndex].name)
            this.isOpen = false
        },

        // When up arrow pressed while suggestions are open
        up () {
            if (this.currIndex > 0) {
                this.currIndex--
            }
        },

        // When down arrow pressed while suggestions are open
        down () {
            if (this.currIndex < this.matches.length - 1) {
                this.currIndex++
            }
        },

        // For highlighting element
        isActive (index) {
            return index === this.currIndex
        },

        sendSocket() {
            socket.emit('sendFriendRequest', {
                from: this.getID,
                to: this.userInfo._id,
                send_time: Date.parse(new Date())
            })
        },

        updateSocket() {
            socket.removeAllListeners()
            socket.on('receiveFriendRequest', (data) => {
                if(data.from === this.getID) {
                    return
                }
                if(this.getID === data.to) {
                    this.requests.push(data)
                    this.hasRequest = true
                }
            })
        },
        //get all friend apply requests
        async getRequests() {
            const result = await getFriendRequests(this.getID)
            if(result.data.success) {
                this.requests = result.data.result
                this.hasRequest = true
            } else {
                this.hasRequest = false
            }
        },
        //accept friend
        async acceptFriend(request) {
            const result = await acceptFriendRequest(request._id)
            if(result.data.success) {
                this.$notify({
                    type: 'success',
                    group: 'auth',
                    text: 'you have accepted friend application'
                })
                this.getRequests()
            } else {
                this.$notify({
                    type: 'warn',
                    group: 'auth',
                    text: 'you failed to accept friend application'
                })
            }
        },
        //reject friend
        async rejectFriend(request) {
            const result = await rejectFriendRequest(request._id)
            if(result.data.success) {
                this.$notify({
                    type: 'success',
                    group: 'auth',
                    text: 'you have rejected friend application'
                })
                this.getRequests()
            } else {
                this.$notify({
                    type: 'warn',
                    group: 'auth',
                    text: 'you failed to reject friend application'
                })
            }
        },
        //apply friend
        async applyFriend() {
            let data = {
                from: this.getID,
                to: this.userInfo._id,
                send_time: Date.parse(new Date())
            }
            const res = await sendFriendRequest(data)
            if(res.data.success) {
                this.$notify({
                    type: 'success',
                    group: 'auth',
                    text: res.data.message
                })
                this.showRequest = false
                this.sendSocket()
            } else {
                 this.$notify({
                    type: 'warn',
                    group: 'auth',
                    text: res.data.message
                })
            }
        },
        // When one of the suggestion is clicked
        async clickSuggestion(index) {
            this.$emit('input', this.matches[index].name)
            this.isOpen = false
            this.userInfo = this.matches[index]
            try {
                const res = await checkRequest({from: this.getID, to: this.matches[index]._id})
                if(res.data.success) {
                    //sent request, pending
                    if(res.data.request.state === 'pending') {
                        this.isPending = true
                    }
                    //already friends
                    if(res.data.request.state === 'accepted') {
                        this.isFriends = true
                    }
                    //sent request, rejected
                    if(res.data.request.state === 'rejected') {
                        this.rejected = true
                    }
                } else {
                    //havent sent request
                    this.showRequest = true
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.form-control {
    box-shadow: none;
    border: none;
    background: #fff;
    outline: none;
    font-size: 14px;
    padding: 6px 8px;
    background-color: transparent;
    display: inline-block;
}
.dropdown-menu {
    position: absolute;
    z-index: 10;
    width: 205px;
    padding: 5px;
    margin: 8px 0 0;
    font-size: 13px;
    text-align: left;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,.175);
}
.bg {

}
.info {
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    position: absolute;
    top: 20%;
    padding: 5px;
    background: white;
    border-radius: 10px;
    width: 210px;
    text-align: center;
    .user {
        font-size: 15px;
        margin: 10px 0;
    }
    .btn-apply {
            font-size: 14px;
            padding: 5px 7px;
            margin: 8px 0;
            color: #00a1d6;
            border: 1px solid #00a1d6;
            border-radius: 4px;
            background: none;
            cursor: pointer;
            &:hover {
                background: #00a1d6;
                color: #fff;
            }
            .fa {
                margin-right: 4px;
            }
        }
}
li {
    padding: 5px 0 2px 5px;
    &:hover {
        background: #eee;
    }
    .author {
        margin-bottom: 8px;
        font-size: 13px;
        overflow: hidden;
        .name {
            display: inline-block;
            vertical-align: middle;
            overflow: hidden;
            width: 152px;
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
</style>