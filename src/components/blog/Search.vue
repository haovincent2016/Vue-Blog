<template>
<div class="search-wrapper">
	<div class="search-bar">
        <input v-model="tempText" type="text" id="search-keyword" placeholder="search title or content">
		<button @click="search()" class="btn search-button">
			<i class="fa fa-search"></i>
			<span>Search</span>
		</button>
	</div>
	<div class="search-cat">
	</div>
	<div class="search-filter">
	</div>
	<div class="search-result">
		<list :source="sourcePage"></list>
	</div>
	<div class="search-recommend" v-if="!searchText && !searchState">
		<div class="search-hotSearch">
			<div class="search-title"><i class="fa fa-line-chart"></i><span class="search-subTitle">Daily Hot</span></div>
			<ul class="search-hotlist">
				<li v-for="(item, index) in 8" :key="item.id">
					<span class="search-hotlist-num special">{{ index+1 }}</span>
					<span title="test 1" class="search-hotlist-name">
						<a href="">test {{ item }}</a>
					</span>
				</li>
			</ul>
			<div class="noHotResult" v-if="noHot"><span>No records found</span></div>
		</div>
		<div class="search-history">
			<div class="search-title">
				<i class="fa fa-clock-o"></i>
				<span class="search-subTitle">Search History(5)</span>
				<i class="fa fa-trash-o"></i>
				<span class="search-operation" @click="clearHistory()">clear</span>
			</div>
			<ul class="search-detail">
				<li class="suggest-item" v-for="(item, index) in searchHistory" :key="item.id" @click="searchOld(index)">
					<a>{{ item }}</a>
				</li>
			</ul>
			<div class="noLocalResult" v-if="noHistory"><span>No history found</span></div>
		</div>
	</div>			
</div>
</template>

<script>
import list from './Articles'
import { mapGetters } from 'vuex'
export default {
	mounted() {
		const that = this
		//inital state
		if(this.searchHistory.length === 0) {
			this.noHistory = true
		} else {
			this.noHistory = false
		}
		//watch search text and history change
		this.$store.watch(() => { return that.$store.getters.getSearchText}, (val) => {
           that.tempText = val
		})
		this.$store.watch(() => { return that.$store.getters.getHistory}, (val) => {
           if(val.length === 0) {
			   that.noHistory = true
		   } else {
			   that.noHistory = false
		   }
		})
		//pass search text from header
		if(this.$route.params.search) {
			this.tempText = this.$route.params.search
			this.search()
		}
	},
	data () {
		return {
			/*which page retrieve article list*/
			sourcePage: 'search',
			tempText: '',
			noHot: false,
			noHistory: false
		}
	},
	computed: {
		...mapGetters({
			searchState: 'getSearch',
			searchText: 'getSearchText',
			searchHistory: 'getHistory'
		})
	},
	methods: {
		clearHistory() {
            this.$store.dispatch('pushHistory', 'clear')
		},
		search() {
			if(!this.tempText) {
				this.$notify.info({
					title: 'Notice',
					message: 'please enter some text before searching',
					position: 'top-left'
				})
			} else {
				this.$store.dispatch('searchState', {state: true, text: this.tempText})
				this.$store.dispatch('pushHistory', this.tempText)
			}
		},
		searchOld(index) {
            this.$store.dispatch('searchState', {state: true, text: this.searchHistory[index]})
        }
	},
	components: {
		list
	}
}
</script>

<style lang="scss" scoped>
.fa-line-chart {
	color: #00a1d6;
	margin-right: 6px;
	font-size: 13px;
}
.fa-clock-o {
	color: #00a1d6;
	margin-right: 3px;
	font-size: 16px;
}
.fa-trash-o {
	font-size: 12px;
	color: #333;
	margin-left: 8px;
}
@media screen and (min-width: 421px) {
.search-wrapper {
	position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
	.search-bar {
		padding-top: 66px;
		height: 42px;
		width: 620px;
		margin: 0 auto;
		position: relative;
		input {
			border: 2px solid #ccd0d7;
			height: 100%;
			width: 465px;
			background: #fff;
			border-radius: 4px;
			display: inline-block;
			font-size: 16px;
			padding-left: 18px;
			&:focus {
				outline: none;
			}
		}
		.search-button {
			cursor: pointer;
			float: right;
			width: 124px;
			padding: 1px 4px;
			color: #fff;
			background: #00a1d6;
			font-size: 14px;
			letter-spacing: 1px;
			line-height: 42px;
			text-align: center;
		}
	}
	.search-result {
		width: 630px;
		margin: 80px auto;
	}
	.search-recommend {
		margin-top: 35px;
		.search-hotSearch {
			border-radius: 6px;
			float: left;
			width: 350px;
			height: 175px;
			padding: 18px 10px 18px 18px;
			margin-right: 10px;
			margin-left: 180px;
			border: 1px solid #ddd;
			background: #fff;
			.search-title {
				position: relative;
				font-size: 14px;
				margin-bottom: 13px;
			}
			.search-hotlist {
				li {
					width: 135px;
					border-bottom: 1px dotted #eee;
					margin-right: 35px;
					line-height: 20px;
					display: inline-block;
					padding-bottom: 4px;
					margin-bottom: 5px;
					.search-hotlist-num {
						vertical-align: middle;
						width: 16px;
						color: #d3d3d3;
						font-size: 12px;
						line-height: 16px;
						font-family: Arial;
						margin-right: 8px;
						text-align: center;
					}
					.search-hotlist-name {
						display: inline-block;
						width: 80px;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
						vertical-align: middle;
						margin-right: 14px;
						a {
							outline: 0;
							color: #00a1d6;
							text-decoration: none;
							cursor: pointer;
						}
					}
				}
			}
			.noHotResult {
				text-align: center;
			}
		}
		.search-history {
			border-radius: 6px;
			display: inline-block;
			width: 187px;
			height: 175px;
			padding: 18px;
			border: 1px solid #ddd;
			background: #fff;
			.search-title {
				position: relative;
				font-size: 14px;
				margin-bottom: 13px;
				.search-operation {
					font-size: 12px;
					cursor: pointer;
					color: #666;
					&:hover {
						color: #333;
					}
				}
			}
			.search-detail {
				li {
					width: 150px;
					border-bottom: 1px dotted #eee;
					display: inline-block;
					padding-bottom: 5px;
					padding-left: 10px;
					margin-bottom: 5px;
					float: left;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					a {
						outline: 0;
						color: #00a1d6;
						text-decoration: none;
						cursor: pointer;
					}
				}
			}
			.noLocalResult {
				text-align: center;
			}
		}
	}
}
}
@media screen and (max-width: 420px) {
.search-wrapper {
	position: relative;
	width: 100%;
	.search-bar {
		padding-top: 66px;
		height: 42px;
		width: 300px;
		margin: 0 auto;
		position: relative;
		input {
			border: 2px solid #ccd0d7;
			height: 42px;
			width: 282px;
			background: #fff;
			border-radius: 4px;
			display: inline-block;
			font-size: 16px;
			padding-left: 18px;
			&:focus {
				outline: none;
			}
		}
		.search-button {
			cursor: pointer;
			margin-top: 5px;
			margin-left: 30%;
			width: 124px;
			padding: 1px 4px;
			color: #fff;
			background: #00a1d6;
			font-size: 14px;
			letter-spacing: 1px;
			line-height: 42px;
			text-align: center;
		}
	}
	.search-result {
		position: relative;
		width: 95%;
		margin: 80px auto;
	}
	.search-recommend {
		margin-top: 35px;
		width: 100%;
		.search-hotSearch {
			width: 84%;
			border-radius: 6px;
			height: 175px;
			padding: 18px;
			margin: 0 12px;
			border: 1px solid #ddd;
			background: #fff;
			.search-title {
				text-align: center;
				position: relative;
				font-size: 14px;
				margin-bottom: 13px;
			}
			.search-hotlist {
				li {
					width: 140px;
					border-bottom: 1px dotted #eee;
					margin-right: 16px;
					line-height: 20px;
					display: inline-block;
					padding-bottom: 4px;
					margin-bottom: 5px;
					.search-hotlist-num {
						vertical-align: middle;
						width: 16px;
						color: #d3d3d3;
						font-size: 12px;
						line-height: 16px;
						font-family: Arial;
						margin-right: 8px;
						text-align: center;
					}
					.search-hotlist-name {
						display: inline-block;
						width: 80px;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
						vertical-align: middle;
						margin-right: 14px;
						a {
							outline: 0;
							color: #00a1d6;
							text-decoration: none;
							cursor: pointer;
						}
					}
				}
			}
			.noHotResult {
				text-align: center;
			}
		}
		.search-history {
			border-radius: 6px;
			display: inline-block;
			margin: 5px 12px;
			height: 175px;
			width: 84%;
			padding: 18px;
			border: 1px solid #ddd;
			background: #fff;
			.search-title {
				text-align: center;
				position: relative;
				font-size: 14px;
				margin-bottom: 13px;
				.search-operation {
					font-size: 14px;
					cursor: pointer;
					color: #666;
					&:hover {
						color: #333;
					}
				}
			}
			.search-detail {
				margin-left: 21%;
				li {
					width: 185px;
					border-bottom: 1px dotted #eee;
					display: inline-block;
					padding-bottom: 5px;
					padding-left: 10px;
					margin-bottom: 5px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					a {
						outline: 0;
						color: #00a1d6;
						text-decoration: none;
						cursor: pointer;
					}
				}
			}
			.noLocalResult {
				text-align: center;
			}
		}
	}
}
}
</style>