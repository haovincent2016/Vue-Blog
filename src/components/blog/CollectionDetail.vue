<template>
<div class="collection-box">
    <div v-show="showComfirmation" class="comfirmation">
        <div class="comfirmation-form">
            <div @click="showComfirmation = false" class="close">&times;</div>
            <p class="title">Are you sure to delete this collection?</p>
            <div class="btn-group">
                <button class="subscribe" @click="deleteCol">Yes</button>
                <button class="delete" @click="showComfirmation = false">Cancel</button>
            </div>
        </div>
    </div>
    <div class="collection-header">
        <div class="bg-box">
            <img src="/static/beach-background.jpg" class="thumb bg loaded">
        </div>
        <!--collection title-->
        <h1 v-if="login && !showInput && isOwner" @click="showInput = true" class="title">{{ collection.name }}
            <img src="//gold-cdn.xitu.io/v3/static/img/pencil.601a6df.svg" alt="edit" class="edit-btn">
        </h1>
        <input v-if="showInput" :placeholder="collection.name" v-model="newtitle" @blur="saveTitle()" class="edit-input" autofocus>
        <h1 v-if="!login || !isOwner" class="title">{{ collection.name }}</h1>
        <!--collection description-->
        <p v-if="login && !showDesc && isOwner" @click="showDesc = true" class="description">{{ collection.description }}
            <img src="//gold-cdn.xitu.io/v3/static/img/pencil.601a6df.svg" alt="edit" class="edit-btn">
        </p>
        <input v-if="showDesc" :placeholder="collection.description" v-model="newdesc" @blur="saveDesc()" class="edit-desc" autofocus>
        <p v-if="!login || !isOwner" class="description">{{ collection.description }}</p>
    </div>
    <div class="info-box">
        <div class="container">
            <ul class="info-list left">
                <li class="item">{{ count }} Articles</li>
                <li class="item">{{ subscriber }} Subscribers</li>
                <li class="item">{{ collection.created_at | moment }} Created</li>
            </ul>
            <ul class="info-list right">
                <button class="subscribe" v-if="!substate" @click="subCollection">Subscribe</button>
                <button class="unsubscribe" v-if="substate" @click="unsubCollection">Unsubscribe</button>
                <button class="delete" v-if="isOwner" @click="showComfirmation = true">Delete</button>
            </ul>
        </div>
    </div>
    <div class="split-line"></div>
    <div id="list-container">
        <list :source="sourcePage"></list>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import list from './Articles'
import * as helper from '@/helper/collectionHelper'
import moment from 'moment'
export default {
    mounted() {
        this.getDetail()
    },
	data() {
		return {
            sourcePage: 'collection',
            collection: {},
            substate: false,
            count: 0,
            subscriber: 0,
            isOwner: false,
            showInput: false,
            showDesc: false,
            newtitle: '',
            newdesc: '',
            showComfirmation: false
		}
    },
    filters: {
        moment: function(date) {
            return moment(date).format("YYYY-M-D, h:mm:ss a")
        }
    },
    computed: {
        ...mapGetters({
            login: 'getState',
            userid: 'getID'
        })
    },
    methods: {
        async saveTitle() {
            if(this.newtitle == this.collection.name || this.newtitle == '') {
                this.showInput = false
                return
            } else {
                try {
                    const res = await helper.editTitle(this.$route.params.id, this.newtitle)
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: res.data.message,
                            position: 'top-left'
                        })
                        this.showInput = false
                        this.getDetail()
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
            }
        },
        async saveDesc() {
             if(this.newdesc == this.collection.description || this.newdesc == '') {
                this.showDesc = false
                return
            } else {
                try {
                    const res = await helper.editDesc(this.$route.params.id, this.newdesc)
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: res.data.message,
                            position: 'top-left'
                        })
                        this.showDesc = false
                        this.getDetail()
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
            }
        },
        async getDetail() {
            try {
                const res = await helper.getCollection(this.$route.params.id)
                if(res.data.success) {
                    this.collection = res.data.collection
                    this.count = res.data.collection.articles.length
                    this.subscriber = res.data.collection.subscriber.length
                    this.newtitle = res.data.collection.name
                    this.newdesc = res.data.collection.description
                    if(this.login) {
                        if(this.collection.owner._id == this.userid) {
                            this.isOwner = true
                        } else {
                            this.isOwner = false
                        }
                    } 
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async subCollection() {
            if(this.isOwner) {
                //cannot subscribe to own collection
                this.$notify.info({
                    title: 'Notice',
                    message: 'sorry, you cannot subscribe to your own collection',
                    position: 'top-left'
                })
            } else if (this.login) {
                try {
                    const res = await helper.subscribeCollection(this.$route.params.id, this.userid)
                    if(res.data.success) {
                        this.substate = true
                        this.subscriber += 1
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'you have subscribed to this collection',
                            position: 'top-left'
                        })
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'sorry, please try again later',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log(err.message)
                }
            } else {
                this.$store.dispatch('displayModal', { display: true, login: 'login' })
            }
        },
        async unsubCollection() {
            if(this.isOwner) {
                //cannot unsubscribe to own collection
                this.$notify.info({
                    title: 'Notice',
                    message: 'sorry, you cannot unsubscribe to your own collection',
                    position: 'top-left'
                })
            } else if (this.login) {
                try {
                    const res = await helper.unsubscribeCollection(this.$route.params.id, this.userid)
                    if(res.data.success) {
                        this.substate = false
                        this.subscriber -= 1
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'you have unsubscribed to this collection',
                            position: 'top-left'
                        })
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'sorry, please try again later',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log(err.message)
                }
            } else {
                this.$store.dispatch('displayModal', { display: true, login: 'login' })
            }
        },
        async deleteCol() {
            this.showComfirmation = false
            if(this.isOwner) {
                try {
                    const res = await helper.deleteCollection(this.$route.params.id)
                    if(res.data.success) {
                        this.$router.push('/mycollect')
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'you have deleted this collection',
                            position: 'top-left'
                        })
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'sorry, please try again later',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log(err.message)
                }
            } else {
                return
            }
        }
    },
    components: {
        list
    }
}
</script>

<style lang="scss" scoped>
.comfirmation {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100%; 
    height: 100%; 
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3); 
    z-index: 500; 
    cursor: pointer;
    .comfirmation-form {
        position: relative;
        padding: 2rem;
        width: 23rem;
        max-width: 100%;
        font-size: 1.167rem;
        background-color: #fff;
        border-radius: 8px;
        box-sizing: border-box;
        /* The Close Button */
        .close {
            color: #aaa;
            float: right;
            font-size: 30px;
            font-weight: bold;
            line-height: 23px;
            &:hover {
                 color: black;
                text-decoration: none;
                cursor: pointer;
            }
        }
        .title {
            font-size: 1.3rem;
            margin: 0 0 2rem;
            text-align: center;
        }
        .btn-group {
            text-align: center;
        }
    }
}
.collection-box {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    margin-bottom: 45px;
    .collection-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 290px;
        .bg-box {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            .bg {
                width: 100%;
                height: 100%;
            }
        }
        .title {
            position: relative;
            color: #fff;
            font-size: 38px;
            font-weight: 700;
            .edit-btn {
                margin-left: 7px;
                cursor: pointer;
            }
        }
        .edit-input {
            font-size: 38px;
            font-weight: 700;
            text-align: center;
            color: #fff;
            background: none;
            border: none;
            z-index: 1;
        }
        .description {
            position: relative;
            margin: 15px 0 0;
            color: #fff;
            font-size: 22px;
            .edit-btn {
                margin-left: 7px;
                cursor: pointer;
            }
        }
        .edit-desc {
            width: 90%;
            margin-top: 15px;
            font-size: 22px;
            text-align: center;
            color: #fff;
            background: none;
            border: none;
            z-index: 1;
        }
    }
    .info-box {
        position: relative;
        padding: 1.5rem 0;
        line-height: 1;
        background-color: #f8f9fa;
        .container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            box-sizing: border-box;
            position: relative;
            margin: 0 auto;
            width: 100%;
            max-width: 960px;
            .info-list {
                font-size: 1.167rem;
                color: #909090;
                .item {
                    margin-right: 5px;
                    padding-top: 5px;
                    padding-left: 10px;
                    border-left: 1px solid lightgrey;
                }
                .right {
                    float: right;
                }
            }
        }
    }
}
.subscribe {
    font-size: 14px;
    padding: 5px 10px;
    margin-top: 5px; 
    color: #00a1d6;
    border: 1px solid #00a1d6;
    border-radius: 5px;
    background: none;
    cursor: pointer;
    &:hover {
        background: #00a1d6;
        color: #fff;
    }
}
.unsubscribe {
    font-size: 14px;
    padding: 5px 10px;
    margin-top: 5px; 
    border: 1px solid #00a1d6;
    border-radius: 5px;
    background: #00a1d6;
    color: #fff;
    cursor: pointer;
    &:hover {
        background: #e06753;
        border: 1px solid #e06753;
    }
}
.delete {
    margin-left: 5px;
    font-size: 14px;
    padding: 5px 10px;
    margin-top: 5px; 
    color: #f4424e;
    border: 1px solid #f4424e;
    border-radius: 5px;
    background: none;
    cursor: pointer;
    &:hover {
        background: #f4424e;
        color: #fff;
    }
}
.split-line {
    margin: -5px 0 15px;
}
#list-container {
    padding: 15px 40px 50px;
}
</style>