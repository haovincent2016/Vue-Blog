<template>
    <div class="tag-container">
	    <div class="tag-header">
            <h3>Tags</h3>
            <div class="refresh">
                <span @click="refreshList()">refresh</span>
                <i v-if="!loading" class="fa fa-refresh"></i>
                <i v-if="loading" class="fa fa-refresh fa-spin fa-fw"></i>
            </div>
        </div>
        <div class="tag-wrapper">
            <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
            <ul class="tag-list" v-if="!loading">
                <li class="tag-item" v-for="(tag, index) in tags" :key="tag.id">
                    <a class="tag-link" @click="tagDetail(tag)">
                        <img :src="tag.thumbnail" class="tag-img" alt="64">
                        <div class="tag-title">{{ tag.title }}</div>
                    </a>
                    <button v-if="!substate[index]" @click="subscribeTag(tag, index)" class="subscribe">Subscribe</button>
                    <button v-if="substate[index] && hoverindex !== index" @click="unsubscribeTag(tag, index)" @mouseover="onHover(index, true)" @mouseout="onHover(index, false)" class="unsubscribe">Subscribed</button>
                    <button v-if="substate[index] && hoverindex === index" @click="unsubscribeTag(tag, index)" @mouseout="onHover(index, false)" class="unsubscribe">Unsubscribe</button>
                </li>
            </ul>
        </div>
        <!--
        <div class="view-more">
            <button class="more">View All Tags</button>
        </div>	
        -->	
    </div>
</template>

<script>
import { getTags, subTag, unsubTag, addUser, removeUser, getUserTags } from '@/helper/articleHelper'
import { mapGetters } from 'vuex'
import { each, find } from 'underscore'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
    mounted() {
        this.retrieveTags()
    },
	data () {
		return {
            /*loading indicator*/
			color: '#dddddd',
      		size: '12px',
            loading: true,

            substate: [],
            tags: [],
            usertags: [],
            hoverindex: -1
		}
    },
    computed: {
        ...mapGetters([
            'getID',
            'getState'
        ]),
        hovered: function() {
           if(this.btnhover) {
                return 'Unsubscribe'
            } else {
                return 'Subscribed'
            } 
        }
    },
    methods: {
        onHover(index, state) {
            if(state) {
                this.hoverindex = index
            } else {
                this.hoverindex = -1
            }
        },
        async retrieveTags() {
            try {
                const res = await getTags()
                if(this.getID) {
                    const user = await getUserTags({ userid: this.getID })
                }
                this.loading = false
                if(res.data.success) {
                    this.tags = res.data.tags
                    if (user.data.success) {
                        this.usertags = user.data.user.tags
                        this.checkState(res.data.tags, user.data.user.tags)
                    } else {
                        //notification
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'please refresh to get list',
                            position: 'top-left'
                        })
                    }
                }
            } catch(err) {
                console.log('error occurs when retrieving tags')
            }
        },
        checkState(tags, usertags) {
            const that = this
            each(tags, function(tag, index) {
                let found = find(usertags, function(usertag) {
                    return tag._id == usertag._id
                })
                if(found) {
                    that.substate[index] = true
                } else {
                    that.substate[index] = false
                }
            })
        },
        async refreshList() {
            this.loading = true
            const that = this
            setTimeout(function() {
                that.loading = false
                that.tags.reverse()
            }, 500);
        },
        async subscribeTag(tag, index) {
            if(this.getState) {
                try {
                    const res = await subTag({ tagid: tag._id, userid: this.getID })
                    const add = await addUser({ tagid: tag._id, userid: this.getID })
                    if(res.data.success && add.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'subscribed to a tag',
                            position: 'top-left'
                        })
                        this.substate.splice(index, 1, true)
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: 'failed to subscribe to tag',
                            position: 'top-left'
                        })
                    }
                } catch(err) {
                    console.log('error occurs')
                }
            } else {
                this.$notify({
                    title: 'Warning',
                    type: 'warning',
                    message: 'please login first',
                    position: 'top-left'
                })
            }
        },
        async unsubscribeTag(tag, index) {
            try {
                const res = await unsubTag({ tagid: tag._id, userid: this.getID })
                const remove = await removeUser({ tagid: tag._id, userid: this.getID })
                if(res.data.success && remove.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'unsubscribed to a tag',
                        position: 'top-left'
                    })
                    this.substate.splice(index, 1, false)
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'failed to unsubscribe to tag',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('error occurs')
            }
        },
        tagDetail(tag) {
            this.$router.push({ path: `/tagdetail/${tag._id}` })
        }
    },
	components: {
		PulseLoader
	}
}
</script>

<style lang="scss" scoped>
.v-spinner {
	text-align: center;
	margin-top: 140px;
}

.tag-container {
    height: 334px;
	background: #fff;
    margin-bottom: 20px;
    &:hover {
        box-shadow: 1px 1px 2px #ccc;
    }
    .tag-header {
        position: relative;
		line-height: 24px;
		height: 24px;
		padding: 10px 10px 0 10px;
        h3 {
            float: left;
			margin: 2px 0 0 0;
			font-weight: 500;
			color: #8c8c8c;
        }
        .refresh {
            float: right;
            position: relative;
            vertical-align: middle;
            height: 23px;
            margin-right: 6px;
            cursor: pointer;
        }
    }
    .tag-wrapper {
        margin-top: 5px;
        text-align: center;
        ul {
            padding: 7px 0 28px 0;
            li {
                padding: 4px;
                margin: 2px;
                border-radius: 3px;
                border: 1px solid #f7f7f7;
                display: inline-block;
                a {
                    height: 48px;
                    vertical-align: middle;
                    .tag-img {
                        height: 62px;
                        width: 62px;
                        border-radius: 50%;
                    }
                    .tag-title {
                        margin-top: 3px;
                        text-align: center;
                        font-size: 12px;
                    }
                }
                .subscribe {
                    width: 68px;
                    font-size: 11px;
                    margin: 6px 4px;
                    padding: 2px 5px;
                    color: #00a1d6;
                    border: 1px solid #00a1d6;
                    border-radius: 3px;
                    background: none;
                    cursor: pointer;
                    &:hover {
                        background: #00a1d6;
                        color: #fff;
                    }
                }
                .unsubscribe {
                    width: 68px;
                    font-size: 11px;
                    margin: 6px 1px;
                    padding: 2px 1px;
                    color: #fff;
                    border: 1px solid #00a1d6;
                    border-radius: 3px;
                    background: #00a1d6;
                    cursor: pointer;
                    &:hover {
                        background: #00aae2;
                        border: 1px solid #00aae2;
                    }
                }
            }
        }
    }
    .view-more {
        text-align: center;
        padding-bottom: 8px;
        .more {
            font-size: 11px;
            padding: 2px 6px;
            color: #ea6f5a;
            border: 1px solid #ea6f5a;
            border-radius: 3px;
            background: none;
            cursor: pointer;
            &:hover {
                background: #ea6f5a;
                color: #fff;
            }
        }
    }
}
</style>