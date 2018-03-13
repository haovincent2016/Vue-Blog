<template>
<div>
    <div class="rank-list-wrap">
        <ul class="rank-list hot-list">
            <li v-for="(article, index) in articles" 
                :key="article.id"
                @mouseover="setIndex(index)"
                @mouseleave="resetIndex()"
                @click="showDetail(article)"
                class="rank-item highlight">
                <i class="num">{{ index + 1 }}</i>
                <a class="info-wrap clearfix">
                    <div class="lazy-img preview">
                        <img alt="cover" :src="article.cover">
                    </div>
                    <div class="detail">
                        <p class="title">{{ article.title }} - {{ article.author.name }}</p>
                        <p class="point">views: {{ article.view }} likes: {{ article.like }}</p>
                    </div>
                </a>
            </li>
            <li v-for="(other, index) in others" 
                :key="other.id"
                @mouseover="setIndex(index+3)"
                @mouseleave="resetIndex()"
                @click="showDetail()"
                class="rank-item highlight">
                <i class="num-other">{{ index + 4 }}</i>
                <a class="info-wrap clearfix">
                    <div class="detail-other">
                        <p class="title-list">{{ other.title }} - {{ other.author.name }}</p>
                        <p class="point">views: {{ other.view }} likes: {{ other.like }}</p>
                    </div>
                </a>
            </li>
        </ul>
    </div>
    <div v-if="onHover" class="info-module" :style="{top: topMargin + 'px'}">
        <div class="pop-title">{{ preview.title }}</div>
        <div class="pop-info">
            <span class="name">{{ preview.author.name }}</span>
            <span class="time">{{ preview.created_at | moment }}</span>
            <span class="tag">{{ preview.tag.title }}</span>
        </div>
        <div class="pop-pre">
            <img alt="cover" class="preview-img" :src="preview.cover">
            <p class="excerpt" v-if="preview.type == 'markdown'" v-html="$options.filters.excerpt(preview.content)"></p>
            <p class="excerpt" v-if="preview.type == 'richtext'" v-html="$options.filters.richtext(preview.content)"></p>
        </div>
    </div>
</div>
</template>
<script>
import { getHot, getTrending, addView } from '../../helper/articleHelper'
import marked from '../../helper/marked.js'
import moment from 'moment'
export default {
    mounted() {
        this.getArticlesRank()
    },
    data() {
        return {
            currentIndex: 1,
            onHover: false,
            topMargin: 1028,
            articles: [],
            others: [],
            preview: {}
        }
    },
    props: ['selection'],
    watch: {
        selection() {
            this.getArticlesRank()
        }
    },
    filters: {
        moment: function(date) {
            return moment(date).format("YYYY-M-D, h:mm:ss a")
        },
        excerpt: function(content) {
            if(content.length > 39) {
                let excerpt = marked(content).slice(0, 40) + '...'
                return excerpt
            } else {
                return marked(content)
            }
        },
        richtext: function(content) {
            if(content.length > 178) {
                return content.slice(0, 179) + '...'
            } else {
                return content
            }
        }
    },
    methods: {
        setIndex(index) {
            this.currentIndex = index
            this.topMargin = index * 70 + 1028
            this.onHover = true
            if(index < 3) {
                this.preview = this.articles[index]
            } else {
                this.preview = this.others[index-3]
            }
        },
        resetIndex() {
            this.currentIndex = 0
            this.onHover = false
        },
        async getArticlesRank() {
            try {
                if(this.selection === 'trending') {
                    const res = await getTrending(0, 3)
                    const otherres = await getTrending(3, 2)
                    this.others = otherres.data
                    this.articles = res.data
                } else {
                    const res = await getHot(0, 3)
                    const otherres = await getHot(3, 2)
                    this.others = otherres.data
                    this.articles = res.data
                }
            } catch(err) {
                console.log(err)
            }
        },
        async showDetail(article) {
            this.article_id =article._id
            this.$router.push({ path: `/articles/${article._id}` })
            try {
                await addView(this.article_id)
            } catch(err) {
                console.log(err)
            }  
        }
    }
}
</script>
<style lang="scss" scoped>
.rank-list-wrap {
    width: 100%;
    overflow: hidden;
    .rank-list {
        padding-bottom: 15px;
        min-height: 278px;
        position: relative;
        float: left;
        .rank-item {
            position: relative;
            padding-left: 25px;
            padding-bottom: 10px;
            margin: 10px 0 0 10px;
            overflow: hidden;
            .num {
                position: absolute;
                color: #fff;
                height: 18px;
                line-height: 18px;
                top: 0;
                left: 0;
                font-size: 12px;
                min-width: 12px;
                text-align: center;
                background-color: #b8c0cc;
                border-radius: 4px;
                padding: 0 3px;
                font-weight: bolder;
                font-style: normal;
                background: #f25d8e;
            }
            .num-other {
                position: absolute;
                color: lightgrey;
                height: 18px;
                line-height: 18px;
                top: 0;
                left: 0;
                font-size: 12px;
                min-width: 12px;
                text-align: center;
                border: 1px solid lightgrey;
                border-radius: 4px;
                padding: 0 3px;
                font-weight: bolder;
                font-style: normal;
            }
            .info-wrap {
                position: relative;
                display: block;
                cursor: pointer;
                .preview {
                    margin-right: 5px;
                    width: 80px;
                    height: 50px;
                    float: left;
                    border-radius: 4px;
                    overflow: hidden;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .detail {
                    float: left;
                    padding-left: 5px;
                    .title {
                        height: 32px;
                        line-height: 32px;
                        width: 150px;
                        padding: 0;
                        overflow: hidden;
                        color: #222;
                        text-align: center;
                    }
                    .title-list {
                        height: 18px;
                        line-height: 18px;
                        margin-top: -3px;
                        padding: 0;
                        overflow: hidden;
                        color: #222;
                        text-align: center;
                    }
                    .point {
                        line-height: 15px;
                        color: #99a2aa;
                        height: 15px;
                        overflow: hidden;
                        text-align: center;
                    }
                }
                .detail-other {
                    height: 48px;
                    border-top: 1px solid #f7f7f7;
                    .title-list {
                        height: 22px;
                        line-height: 22px;
                        margin-top: 3px;
                        overflow: hidden;
                        color: #222;
                        text-align: center;
                    }
                    .point {
                        line-height: 15px;
                        color: #99a2aa;
                        height: 15px;
                        overflow: hidden;
                        text-align: center;
                    }
                }
            }
        }
    }
}
.info-module {
    position:absolute;
    top:0;
    left:700px;
    width:280px;
    height: 150px;
    border:1px solid #ccd0d7;
    border-radius:4px;
    -webkit-box-shadow:rgba(0,0,0,.16) 0 2px 4px;
    box-shadow:0 2px 4px rgba(0,0,0,.16);
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
    z-index:100;
    overflow:hidden;
    background-color:#fff;
    padding:12px 12px 0 12px;
    .pop-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
        line-height: 12px;
        width: 100%;
    }
    .pop-info {
        display: inline-block;
        height: 12px;
        margin: 1px 0 5px 0;
        width: 100%;
        padding-bottom: 7px;
        border-bottom: 1px solid #e1e1e1;
        margin-right: 4px; 
        .tag {
            height: 12px;
            padding: 1px 6px;
            margin-top: -1px;
            color: #ea6f5a;
            border: 1px solid #ea6f5a;
            background: none;
            border-radius: 3px;
            float: right
        }
    }
    .pop-pre {
        width: 100%;
        height: 88px;
        float: left;
        margin-right: 8px;
        margin-top: 4px;
        border-radius: 4px;
        img {
            width: 46%;
            height: 70px;
        }
        .excerpt {
            width: 50%;
            margin: 8px 0 0 8px;
            float: right;
        }
    }
}
</style>