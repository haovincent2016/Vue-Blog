<template>
<div>
    <div class="list-header">
        <div class="list-menu">
            <ul>
                <li class="item">
                    <span class="title" @click="showCollections = true">My Collections</span>
                    <span class="count">({{ count }})</span>
                </li>
                <li class="item">
                    <span class="title" @click="showCollections = false">Subscribed Tags</span>
                    <span class="count">({{ nums }})</span>
                </li>
                <button class="btn-action" @click="newCollection"><i class="fa fa-plus"></i>New Collection</button>
            </ul>
        </div>
    </div>
    <ul v-if="showCollections" class="collection-list">
        <li v-for="collection in collections" :key="collection.id" class="item">
            <div class="one-collection">
                <a @click="showDetail(collection)" target="_blank" rel="">
                    <div class="thumb">
                        <div class="overlay"></div>
                    </div>
                    <div class="content">
                        <div class="title">{{ collection.name }}</div>
                        <ul class="meta-list">
                            <li class="meta username">{{ collection.owner.name }}</li>
                            <li class="meta entry">{{ collection.articles | number }} Articles</li>
                            <li class="meta follower">{{ collection.subscriber | number }} Subscribers</li>
                        </ul>
                    </div>
                </a>
            </div>
        </li>
    </ul>
    <ul class="tag-wrapper" v-if="!showCollections">
        <li class="tag-item" v-for="(tag, index) in usertags" :key="tag.id">
            <a class="tag-link" @click="tagDetail(tag)">
                <img :src="tag.thumbnail" class="tag-img" alt="64">
                <div class="tag-title">{{ tag.title }}</div>
            </a>
            <button v-if="hoverindex !== index" class="unsubscribe" @click="unsubscribeTag(tag, index)" @mouseover="onHover(index, true)">Subscribed</button>
            <button v-if="hoverindex === index" class="unsubscribe" @click="unsubscribeTag(tag, index)" @mouseout="onHover(index, false)">Unsubscribe</button>
        </li>
    </ul>
    <!--collection box-->
    <box :display="isDisplay"
        :article="empty"
        @open="isDisplay = true" 
        @close="isDisplay = false">
    </box>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { reduce } from 'underscore'
import { getUserTags, unsubTag, removeUser } from '@/helper/articleHelper'
import { getUserCollections } from '@/helper/collectionHelper'
import Box from '@/components/common/CollectionBox'
export default {
    mounted() {
        this.getCollections()
        this.getTags()
    },
	data() {
		return {
            collections: [],
            collection_id: '',
            number: 0,
            /*collection number*/
            count: 0,
            /*subscribed tags number*/
            nums: 0,
            usertags: [],
            /*display collection box*/
            isDisplay: false,
            empty: '',
            showCollections: true,
            hoverindex: -1
		}
    },
    filters: {
        number: function(val) {
            return val.length
        }
    },
    computed: {
        ...mapGetters([
            'getID',
            'getState'
        ])
    },
    methods: {
        onHover(index, state) {
            if(state) {
                this.hoverindex = index
            } else {
                this.hoverindex = -1
            }
        },
        async getCollections() {
            try {
                const res = await getUserCollections(this.getID)
                if(res.data.success) {
                    this.collections = res.data.collections
                    this.count = res.data.collections.length
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        newCollection() {
             if(this.getState) {
                this.isDisplay = !this.isDisplay
                this.getCollections()
            } else {
                this.$router.push({ name: 'signin', query: { redirect: '/'} })
            }
        },
        async getTags() {
             try {
                const res = await getUserTags({ userid: this.getID })
                if(res.data.success) {
                    this.usertags = res.data.user.tags
                    this.nums = res.data.user.tags.length
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        showDetail(collection) {
            this.collection_id =collection._id
            this.$router.push('/zcollect/' + this.collection_id)
        },
        async unsubscribeTag(tag, index) {
            try {
                const res = await unsubTag({ tagid: tag._id, userid: this.getID })
                const remove = await removeUser({ tagid: tag._id, userid: this.getID })
                if(res.data.success && remove.data.success) {
                    this.getTags()
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'unsubscribed to tag',
                        position: 'top-left'
                    })
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'failed to unsubscribe to tag',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        tagDetail(tag) {
            this.$router.push({ path: `/tagdetail/${tag._id}` })
        }
    },
	components: {
		Box
	}
}
</script>

<style lang="scss" scoped>
.tag-wrapper {
    margin-top: 5px;
    padding: 7px 0 28px 0;
    text-align: center;
    .tag-item {
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
.list-header {
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    position: relative;
    border-top: 1px solid rgba(150, 150, 150, 0.1);
    border-bottom: 1px solid rgba(150, 150, 150, 0.1);
    .list-menu {
        align-items: center;
        padding: 0 1rem 0 0;
        height: 50px;
        position: relative;
        font-weight: 500;
        cursor: pointer;
        ul {
            display: flex;
            .item {
                position: relative;
                padding: 1.4rem;
                font-size: 1.3rem;
                cursor: pointer;
                color: #333;
                opacity: .7;
                &:hover {
                    background: #f5f5f5;
                }
            }
            .btn-action {
                position: absolute;
                right: 2%;
                top: 25%;
                font-size: 13px;
                padding: 5px 7px;
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
                    margin-right: 2px;
                }
            }
        }
    }
}
.collection-list {
    padding: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .item {
        margin: 0 0 1.4rem;
        width: 48%;
        height: 13.3rem;
        box-sizing: border-box;
        .one-collection {
            position: relative;
            height: 100%;
            a {
                color: #909090;
                .thumb {
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                    background-position: 50%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-image: url('/static/collectionbg.jpg');
                    opacity: 0.9;
                    .overlay {
                        width:100%;
                        height:100%;
                        position:absolute;
                        background-color:#333;
                        opacity:0.4;
                    }
                }
                .content {
                    position: absolute;
                    top: 1.1rem;
                    left: 1.1rem;
                    right: 1.1rem;
                    bottom: 1.1rem;
                    overflow: hidden;
                    z-index: 1;
                    .title {
                        position: absolute;
                        left: 1rem;
                        right: 4rem;
                        bottom: 3rem;
                        font-size: 21px;
                        font-weight: 500;
                        line-height: 32px;
                        color: #fff;
                        cursor: pointer;
                    }
                    .meta-list {
                        position: absolute;
                        left: 1rem;
                        right: 5em;
                        bottom: 0;
                        height: 32px;
                        font-size: 13px;
                        line-height: 28px;
                        color: #fff;
                        white-space: nowrap;
                        overflow: hidden;
                        .meta {
                            max-width: 6rem;
                            display: inline-block;
                            max-width: 7rem;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }
                }
            }
        }
    }
}
</style>