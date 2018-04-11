<template>
<div>
	<pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
	<ul class="comment-list">
		<li v-for="comment in comments" :key="comment.id">
			<div class="content">
				<div class="author">
					<a class="avatar" target="_blank" >
						<img :src="user.avatar" alt="180">
					</a>      
					<div class="name">
						<a class="blue-link" target="_blank" >{{ user.name }}</a>
						<span v-if="comment.first" class="time">comments on article {{ comment.article.title }}, {{ comment.post_date | moment}}</span>
						<span v-else class="time">reply to user {{ comment.reply_to.name }}, {{comment.post_date | moment}}</span>
					</div>
				</div>
			</div>

			<p class="comment">{{ comment.content }}</p>

			<blockquote>
				<a class="title" href=""> {{ comment.article.title }}</a>
				<p v-if="comment.article.type == 'markdown'" @click="showDetail(comment.article)" class="abstract" v-html="$options.filters.partial(comment.article.content)"></p>
				<p v-if="comment.article.type == 'richtext'" @click="showDetail(comment.article)" class="abstract" v-html="$options.filters.richtext(comment.article.content)"></p>

				<div class="meta">
					<a class="collection-tag" target="_blank" @click="tagPage(comment.article.tag._id)">{{ comment.article.tag.title }}</a>
					<span><i class="fa fa-eye"></i>{{ comment.article.view }}</span> 
					<span><i class="fa fa-commenting"></i>{{ comment.article.comment }}</span>     
					<span><i class="fa fa-heart-o"></i>{{ comment.article.like }}</span>
				</div>
			</blockquote>
		</li>
	</ul>
	<div v-if="comments.length !== 0" class="fix">
		<pagination :current-page="pages.currentPage"
					:total-pages="pages.totalPages"
					@page-changed="pagesChanged">
		</pagination>
	</div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addView } from '@/helper/articleHelper'
import { getUserComments } from '@/helper/commentHelper'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import pagination from '@/components/common/Pagination'
import marked from '@/helper/marked.js'
import moment from 'moment'
export default {
	mounted() {
		this.getComments()
	},
	data () {
		return {
			/*loading indicator*/
			color: '#dddddd',
      		size: '12px',
			loading: true,
			
			comments: [],
			pages: {
                currentPage: 1,
                totalPages: 1
            }
		}
	},
	computed: {
		...mapGetters({
            user: 'getUser'
		})
	},
	filters: {
        moment: function(date) {
            return moment(date).calendar()
		},
		partial: function(content) {
            if(content.length > 40) {
                return marked(content).slice(0, 41)
            } else {
                return marked(content)
            }
        },
        richtext: function(content) {
            if(content.length > 200) {
                return content.slice(0, 201)
            } else {
                return content
            }
        }
	},
	methods: {
		tagPage(tagid) {
            this.$router.push({ path: `/tagdetail/${tagid}` })
		},
		pagesChanged (pageNumber) {
			this.pages.currentPage = pageNumber
			this.getComments()
        },
		async getComments() {
			try {
				const res = await getUserComments(this.user.id, this.pages.currentPage)
				if(res.data.success) {
					this.comments = res.data.comments
				} else {
					this.$notify({
						title: 'Warning',
						type: 'warning',
						message: 'cannot get any user comments',
						position: 'top-left'
					})
				}
				this.loading = false
			} catch(err) {
				console.log(err.message)
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
	},
	components: {
		pagination,
		PulseLoader
	}
}
</script>

<style lang="scss" scoped>
.v-spinner {
	text-align: center;
	margin-top: 50px;
	margin-bottom: 30px;
}
.fix {
    height: 60px;
	padding: 0 22px;
	margin-bottom: 45px;
}
.comment-list {
	margin: 18px;
	padding: 6px;
}
.content {
	padding-right: 200px;
	.author {
		margin-bottom: 14px;
		font-size: 14px;
		.name {
			display: inline-block;
			vertical-align: middle;
			.time {
				padding: 0 8px;
				font-size: 14px;
				color: grey;
			}
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
.comment {
	font-size: 15px;
    line-height: 1.7;
}
blockquote {
    margin-bottom: 0;
    color: #969696;
    border-left: 3px solid #d9d9d9;
    padding: 0 20px 0 16px;
    margin: 12px 0 20px;
    font-size: 13px;
    border-left: 5px solid #eee;
	.abstract {
		cursor: pointer;
	}
	.meta {
		margin-top: 10px;
		font-size: 13px;
		font-weight: 300;
		line-height: 25px;
		.action {
			cursor: pointer;
		}
		span {
			margin: 0 4px;
			color: #8590a6;
			&:hover {
				color: #5b5b5b;
			}
			.fa {
				margin: 0 2px;
			}
		}
		.collection-tag {
			padding: 2px 6px;
			color: #ea6f5a;
			border: 1px solid rgba(236,97,73,.7);
			border-radius: 3px;
		}
	}
}
</style>