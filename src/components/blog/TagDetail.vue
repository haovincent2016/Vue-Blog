<template>
    <div class="tag-wrapper">
	    <div class="tag-header">
            <div class="tag-title">
                {{ tagdetail.title }}
            </div>
            <div class="tag-desc">
                {{ tagdetail.description }}
            </div>
	    </div>
        <div class="tag-operation">
            <img :src="tagdetail.thumbnail" class="thumbnail" />
            <span class="tag-info">
                {{ subscribers }} subscribers, {{ articles }} articles
            </span>
            <ul class="info-list">
                <button class="subscribe" v-if="!substate" @click="subscribeTag()">Subscribe</button>
                <button class="unsubscribe" v-if="substate" @click="unsubscribeTag()">Unsubscribe</button>
            </ul>
            <div class="sort">
            </div>
        </div>
        <div class="tag-detail">
            <list :source="sourcePage"></list>
        </div>			
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { find } from 'underscore'
import list from './Articles'
import { getTag, subTag, unsubTag, addUser, removeUser, getUserTags } from '@/helper/articleHelper'
export default {
    mounted() {
        this.getTagDetail()
    },
	data () {
		return {
            sourcePage: 'tag',
            substate: false,
            tagdetail: {},
            subscribers: 0,
            articles: 0
		}
    },
    computed: {
        ...mapGetters([
            'getID',
            'getState'
        ]),
    },
    methods: {
        checkState(tag, usertags) {
            let found = find(usertags, function(usertag) {
                return tag === usertag._id
            })
            if(found) {
                this.substate = true
            } else {
                this.substate = false
            }
        },
        async getTagDetail() {
            try {
                const res = await getTag(this.$route.params.id)
                const usertags = await getUserTags({ userid: this.getID })
                if(res.data.success) {
                    this.tagdetail = res.data.tag
                    this.subscribers = res.data.tag.subscribers.length
                    this.articles = res.data.tag.articles.length
                    if(usertags.data.success) {
                        this.checkState(this.$route.params.id, usertags.data.user.tags)
                    }
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'failed to get tag detail',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('error occurs')
            }
        },
        async subscribeTag() {
            if(this.getState) {
                try {
                    const res = await subTag({ tagid: this.$route.params.id, userid: this.getID })
                    const add = await addUser({ tagid: this.$route.params.id, userid: this.getID })
                    if(res.data.success && add.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'subscribed to a tag',
                            position: 'top-left'
                        })
                        this.subscribers += 1
                        this.substate = true
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
        async unsubscribeTag() {
            try {
                const res = await unsubTag({tagid: this.$route.params.id, userid: this.getID})
                const remove = await removeUser({ tagid: this.$route.params.id, userid: this.getID })
                if(res.data.success && remove.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'unsubscribed to a tag',
                        position: 'top-left'
                    })
                    this.subscribers -= 1
                    this.substate = false
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
        }
    },
	components: {
		list
	}
}
</script>

<style lang="scss" scoped>
.tag-wrapper {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    .tag-header {
        background: #f8f9fa;
        height: 110px;
        text-align: center;
        padding-top: 40px;
        .tag-title {
            font-size: 25px;
            line-height: 30px;
            font-weight: 700;
            margin-bottom: .3rem;
            color: #666;
        }
        .tag-desc {
            font-size: 14px;
            line-height: 18px;
            font-weight: 500;
            color: #666;
        }
    }
    .tag-operation {
        height: 45px;
        background: #fff;
        padding: 6px;
        .thumbnail {
            background: #f8f9fa;
            height: 42px;
            width: 42px;
            border-radius: 50%;
        }
        .tag-info {
            height: 45px;
            display: inline-block;
            vertical-align: middle;
            margin-left: 3px;
        }
        .info-list {
            color: #909090;
            float: right;
            margin: 8px;
            .subscribe {
                font-size: 14px;
                padding: 5px 10px;
                color: #ea6f5a;
                border: 1px solid #ea6f5a;
                border-radius: 5px;
                background: none;
                cursor: pointer;
                &:hover {
                    background: #ea6f5a;
                    color: #fff;
                }
            }
            .unsubscribe {
                font-size: 14px;
                padding: 5px 10px;
                border: 1px solid #ea6f5a;
                border-radius: 5px;
                background: #ea6f5a;
                color: #fff;
                cursor: pointer;
                &:hover {
                    background: #e06753;
                    border: 1px solid #e06753;
                }
            }
        }
    }
    .tag-detail {
        border-top: 1px solid #f7f7f7;
        background: #fff;
        padding: 20px 20px 48px;
    }
}
</style>