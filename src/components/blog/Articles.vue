<template>
<div :class="{showresult: showbg}">
    <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
    <div v-if="!loading && goback" class="note">
        <p>Return to main search page</p>
        <button class="btn-cancel" @click="resetSearch()">Return</button>
    </div>
    <ul class="article-list" ref="list"> 
        <li v-for="(article, index) in articles" :key="article.id">
            <a class="wrap-img" v-if="selectedArticle != index" target="_blank" :href="article.cover">
                <img :src="article.cover" alt="article cover">
            </a>
            <div class="author">
                <a class="avatar" target="_blank" @click="userPage(article)">
                    <img :src="article.author.avatar" alt="author">
                </a>      
                <div class="name">
                    <a target="_blank" @click="userPage(article)">{{ article.author.name }}</a>
                    <span class="time"> {{ article.created_at | moment }}</span>
                </div>
            </div>
            <div class="content" :class="{full: selectedArticle == index}">
                <a class="title" target="_blank" @click="showDetail(article)">{{ article.title }}</a>
                <div class="abstract" v-if="selectedArticle != index">{{ article.content | rmmd }}
                    <span class="more" v-if="hasMore[index]" @click="showFull(index)">More</span>
                </div>
                <div v-if="article.type == 'markdown' && selectedArticle == index" class="full" v-html="$options.filters.markdown(article.content)"></div>
                <div v-if="article.type == 'richtext' && selectedArticle == index" class="full" v-html="article.content"></div>
            </div>
            <div class="meta" :class="{fixed: selectedArticle == index}">
                <a class="collection-tag" target="_blank" @click="tagPage(article.tag._id)">{{ article.tag.title }}</a>
                <span><i class="fa fa-eye"></i> {{ article.view }}</span> 
                <span><i class="fa fa-commenting"></i> {{ article.comment }}</span>     
                <span><i class="fa fa-heart-o"></i> {{ article.like }}</span>
                <!--add to collection button-->
                <span v-if="source==='home' || source==='search'" class="action" @click="addArticle(article)"><i class="fa fa-bookmark-o"></i> Add</span>
                <!--edit article button-->
                <span v-if="login && source==='author'" class="action" @click="editArticle(article)"><i class="fa fa-pencil-square-o"></i> Edit</span>
                <!--delete article button-->
                <span v-if="login && source==='author'" class="action" @click="deleteArticle(article)"><i class="fa fa-trash-o"></i> Delete</span>
                <!--remove article from collection button-->
                <span v-if="login && isOwner && source==='collection'" class="action" @click="removeCollection(article)"><i class="fa fa-trash-o"></i> Remove</span>
                <span v-if="selectedArticle == index" class="meta-title" @click="showDetail(article)">{{ article.title }}</span>
                <span v-if="selectedArticle == index" class="pull-up" @click="showAbstract(index)"><i class="fa fa-chevron-up"></i></span>
            </div>
        </li>
    </ul>
    <div v-if="!loading && visible" class="note">
        <p>Sorry, there is no article found so far...</p>
        <button class="btn-cancel" @click="resetSearch()">Return</button>
    </div>
    <box :display="isDisplay"
         :article="article_id" 
         @open="isDisplay = true" 
         @close="isDisplay = false">
    </box>
    <div v-if="articles.length !== 0">
        <pagination :current-page="pages.currentPage"
                    :total-pages="pages.totalPages"
                    @page-changed="pagesChanged">
        </pagination>
    </div>
</div>
</template>
<script>
import moment from 'moment'
import removeMd from 'remove-markdown'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { mapGetters } from 'vuex'
import Pagination from '@/components/common/Pagination'
import Box from '@/components/common/CollectionBox'
import { getArticles, addView, getCount, getUserCount, getSearchCount, getTag } from '@/helper/articleHelper'
import { searchArticle } from '@/helper/searchHelper'
import { myArticles } from '@/helper/userHelper'
import marked from '@/helper/marked.js'

export default {
    mounted() {
        const that = this
        this.$store.watch(() => { return that.$store.getters.getSearch}, () => {
            that.searchArticles()
            that.getSearchPages()
        })
        switch (this.source) {
            case 'home':
                this.getArticles()
                this.getPages()
                break
            case 'author':
                this.getUserArticles()
                this.getUserPages()
                break
            case 'collection':
                this.getCollectionArticles()
                break
            case 'tag':
                this.getTagArticles()
                break
            case 'userpage':
                this.getUserPageArticles()
                this.getUserPages()
                break
            case 'search':
                this.loading = false
                break
        }
    },
    data() {
        return {
            /*loading indicator*/
			color: '#dddddd',
      		size: '12px',
            loading: true,
            /*show no article notes*/
            visible: false,
            /*show return options*/
            goback: false,
            showbg: false,
            articles: [],
            article_id: '',
            collection: {},
            isOwner: false,
            pages: {
                currentPage: 1,
                totalPages: 1
            },
            /*display collection popup*/
            isDisplay: false,
            /* article needs more space to show all */
            selectedArticle: -1,
            contentTop: [],
            contentHeight: [],
            hasMore: [],
            showMore: [],
            locked: false,
            prevIndex: -1
        }
    },
    props: [
        'source'
    ],
    watch: {
        loading: function(val) {
            if(!val) {
                this.$nextTick(() => {
                    this.getContentHeight()
                })
            }
        }
    },
    computed: {
        ...mapGetters({
            userid: 'getID',
            login: 'getState',
            searchState: 'getSearch',
            searchText: 'getSearchText'
        })
    },
    components: {
        Pagination,
        Box,
        PulseLoader
    },
    filters: {
        moment: function(date) {
            return moment(date).calendar()
        },
        markdown: function(content) {
            return marked(content)
        },
        encode: function(str) {
            return str.replace(/(<([^>]+)>)/ig, "")
        },
        rmmd: function(str) {
            return removeMd(str)
        }
    },
    methods: {
        trackScroll() {
        },
        //prevent 2 article showFull at same time.
        showFull(index) {
            if(!this.locked) {
                this.selectedArticle = index
                this.$set(this.hasMore, index, false)
                this.prevIndex = index
            } else {
                this.showAbstract(this.prevIndex)
                this.selectedArticle = index
                this.$set(this.hasMore, index, false)
                this.prevIndex = index
            }
            this.locked = true 
        },
        showAbstract(index) {
            this.selectedArticle = -1
            this.$set(this.hasMore, index, true)
            this.locked = false
        },
        userPage(article) {
            let path = article.author._id
            this.$router.push({ path: `/userpage/${path}` })
        },
        tagPage(tagid) {
            this.$router.push({ path: `/tagdetail/${tagid}` })
        },
        addArticle(article) {
            if(this.login) {
                this.article_id = article._id
                this.isDisplay = !this.isDisplay
            } else {
                this.$store.dispatch('displayModal', { display: true, login: 'login' })
            }
        },
        pagesChanged (pageNumber) {
            this.pages.currentPage = pageNumber
            if(this.source === 'home') {
                this.getArticles()
            }
            if(this.source === 'author') {
                this.getUserArticles()
            }
            if(this.source === 'search') {
                this.searchArticles()
            }
        },
        resetSearch() {
            this.visible = false
            this.goback = false
            this.showbg = false
            this.articles = []
            this.$store.dispatch('searchState', {state: false, text: ''})
        },
        getCollectionArticles() {
            this.$http.get('/c/collections/' + this.$route.params.id)
                .then(res => {
                    let skip = (this.pages.currentPage - 1) * 7
                    this.collection = res.data
                    this.loading = false
                    this.articles = []
                    if(res.data.articles.length === 0) {
                        return 
                    } else {
                        this.pages.totalPages = Math.floor((res.data.articles.length - 1) / 7) + 1
                    }
                    if(this.login) {
                        if(this.collection.owner._id == this.userid) {
                            this.isOwner = true
                        } else {
                            this.isOwner = false
                        }
                    }
                    for(let [index, value] of res.data.articles.entries()) {
                        if(index >= skip && index < skip + 7) {
                            this.articles.push(value)
                        }
                    }   
                })
                .catch(err => {
                    console.log(err.message)
                })
        },
        removeCollection(article) {
            this.article_id = article._id
            this.$http.post('/c/remove', { articleid: this.article_id, collectionid: this.$route.params.id })
                .then(res => {
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: res.data.message,
                            position: 'top-left'
                        })
                        this.getCollectionArticles()
                    } else {
                        this.$notify({
                            title: 'Warning',
                            type: 'warning',
                            message: res.data.message,
                            position: 'top-left'
                        })
                    }
                })
                .catch(err => {
                    console.log(err.message)
                })
        },
        //get real height of each article content
        getContentHeight() {
            const listArray = Array.from(this.$refs.list.children)
            //console.log(listArray)
            listArray.forEach((item, index) => {
                this.contentHeight[index] = item.children[2].children[1].scrollHeight
            })
            this.contentHeight.forEach((item, index) => {
                if(item > 95) {
                    this.hasMore.push(true)
                } else {
                    this.hasMore.push(false)
                }
            })
            //console.log(this.contentHeight)
            this.trackScroll()
        },
        async getArticles() {
            try {
                const res = await getArticles(this.pages.currentPage)
                this.articles = res.data
                this.loading = false
            } catch(err) {
                console.log(err.message)
            }
        },
        /*from user dashboard*/
        async getUserArticles() {
			try {
				const res = await myArticles(this.userid, this.pages.currentPage)
                if(res.data.success) {
                    this.articles = res.data.articles
                }
                this.loading = false
            } catch(err) {
                console.log(err.message)
            }
        },
        /*from public user page*/
        async getUserPageArticles() {
            try {
                const res = await myArticles(this.$route.params.id, this.pages.currentPage)
                if(res.data.success) {
                    this.articles = res.data.articles
                }
                this.loading = false
            } catch(err) {
                console.log(err.message)
            }
        },
        async getTagArticles() {
            try {
                this.articles = []
                let skip = (this.pages.currentPage - 1) * 7
                const res = await getTag(this.$route.params.id)
                if(res.data.success) {
                    for(let [index, value] of res.data.tag.articles.entries()) {
                        if(index >= skip && index < skip + 7) {
                            this.articles.push(value)
                        }
                    } 
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'failed to get articles with this tag',
                        position: 'top-left'
                    })
                }
                this.loading = false
            } catch(err) {
                console.log(err.message)
            }
        },
        //search total page not correct
        async searchArticles() {
            if(this.searchState) {
                try {
                    const res = await searchArticle(this.searchText, this.pages.currentPage)
                    this.articles = res.data
                    if(this.articles.length === 0) {
                        this.visible = true
                        this.showbg = false
                        this.goback = false
                    } else {
                        this.showbg = true
                        this.visible = false
                        this.goback = true
                    }
                    this.loading = false
                    this.$store.dispatch('searchState', {state: false, text: this.searchText})         
                } catch(err) {
                    console.log(err.message)
                }
            }
        },
        async showDetail(article) {
            this.article_id =article._id
            this.$router.push({ path: `/articles/${article._id}` })
            try {
                await addView(this.article_id)
            } catch(err) {
                console.log(err.message)
            }  
        },
        async getPages() {
            try {
                const res = await getCount()
                //7 articles per page
                if(res.data === 0) {
                    return 
                } else {
                    this.pages.totalPages = Math.floor((res.data - 1) / 7) + 1
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        /*get user articles total pages*/
        async getUserPages() {
            try {
                if(this.source === 'author') {
                    const res = await getUserCount(this.userid)
                    if(res.data === 0) {
                        return 
                    } else {
                        this.pages.totalPages = Math.floor((res.data - 1) / 7) + 1
                    }
                } else {
                    const res = await getUserCount(this.$route.params.id)
                    if(res.data === 0) {
                        return 
                    } else {
                        this.pages.totalPages = Math.floor((res.data - 1) / 7) + 1
                    }
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async getSearchPages() {
            try {
                const res = await getSearchCount(this.searchText)
                if(res.data === 0) {
                    return 
                } else {
                    this.pages.totalPages = Math.floor((res.data - 1) / 7) + 1
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        /*article operation, currently implemented in admin panel*/
        async editArticle(article) {
            try {

            } catch(err) {
                console.log(err.message)
            }
		},
		async deleteArticle(article) {
            try {

            } catch(err) {
                console.log(err.message)
            }
		}
    }
}
</script>
<style scoped lang="scss">
.v-spinner {
	text-align: center;
	margin-top: 50px;
	margin-bottom: 30px;
}
.note {
    color: #969696;
    font-size: 18px;
    text-align: center;
    margin: 35px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    .btn-cancel {
        margin-top: 18px;
        padding: 5px;
        font-size: 13px;
        color: #00a1d6;
        border: 1px solid #00a1d6;
        background: none;
        border-radius: 6px;
        cursor: pointer;
        &:hover {
            color: #fff;
            background: #00a1d6;
        }
    }
}
.showresult {
    background: #fff;
    padding: 15px 15px 46px;
    &:hover {
        box-shadow: 1px 1px 2px #ccc;
    }
}

.article-list {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
        position: relative;
        margin: 0 0 8px 0;
        padding: 0 2px 8px 0;
        border-bottom: 1px solid #f0f0f0;
        .wrap-img {
            position: absolute;
            top: 24%;
            right: 0;
            width: 180px;
            height: 120px;
            @media screen and (max-width: 420px) {
                width: 135px;
                height: 90px;
            }
            img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
                &:hover {
                    box-shadow: 1px 1px 2px #ccc;
                }
            }
        }
        .author {
            margin-bottom: 8px;
            font-size: 14px;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            .name {
                .time {
                    padding: 0 6px;
                    font-size: 13px;
                    color: grey;
                }
            }
            .avatar {
                margin: 0 5px 0 0;
                width: 32px;
                height: 32px;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #ddd;
                    border-radius: 50%;
                }
            }
        }
        .content {
            display: flex;
            flex-direction: column;
            width: 70%;
            min-height: 136px;
            @media screen and (max-width: 420px) {
                width: 50%;
            }
            .title {
                margin: 4px 0;
                font-size: 18px;
                font-weight: 700;
                line-height: 1.5;
                cursor: pointer;
                &:hover {
                    color: #00a1d6;
                }
            }
            .abstract {
                font-size: 14px;
                line-height: 24px;
                max-height: 95px;
                margin-bottom: 6px;
                overflow: hidden;
                cursor: pointer;
                .more {
                    z-index: 100;
                    position: absolute;
                    right: 30%;
                    bottom: 15.5%;
                    color: #00a1d6;
                    background: #fff;
                    padding: 0 6px;
                    &:hover {
                        background: #eee;
                        color: #666;
                        border-radius: 8px;
                    }
                    @media screen and (max-width: 420px) {
                        right: 50%;
                    }
                }
            }
        }
        .full {
            width: 100%;
        }
        .meta {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            background: #fff;
            .collection-tag {
                padding: 2px 6px;
                color: #ea6f5a;
                border: 1px solid rgba(236,97,73,.7);
                border-radius: 3px;
            }
            span {
                margin: 3px 10px;
                color: #8590a6;
                &:hover {
                    color: #5b5b5b;
                }
            }
            .action, .pull-top {
                cursor: pointer;
            }
            .meta-title {
                cursor: pointer;
                color: #00a1d6;
            }
        }
        .fixed {
            font-size: 13px;
            padding: 8px;
            position: fixed; 
            right: 0; 
            left: 0; 
            bottom: 0; 
            z-index: 5;
            box-shadow: 0 -1px 3px rgba(26, 26, 26, 0.1);
        }
    }
}
</style>