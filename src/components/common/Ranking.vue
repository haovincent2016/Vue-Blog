<template>
    <div class="ranking-container">
	    <div class="ranking-header">
			<h3>Ranking</h3>
			<div class="dropdown" @mouseover="showOption=true" @mouseleave="showOption=false">
				<span class="selected">{{ selectedRange }}</span>
				<i class="fa fa-caret-down"></i>
				<ul class="dropdown-list" v-show="showOption">
					<li :class="{ clicked: selectShort }" class="dropdown-item" @click="setShort()">trending</li>
					<li :class="{ clicked: selectLong }" class="dropdown-item" @click="setLong()">popular</li>
				</ul>
			</div>
		</div>
		<ranking-content :selection="selectedRange"></ranking-content>	
    </div>
</template>

<script>
import rankingContent from './RankingContent'
export default {
	data () {
		return {
			showOption: false,
			//default show hot
			isHot: true,
			selectedRange: 'trending',
			selectShort: true,
			selectLong: false
		}
	},
	methods: {
		setHot() {
			this.isHot = true
		},
		setTrending() {
			this.isHot = false
		},
		setShort() {
			this.selectedRange = 'trending'
			this.selectShort = true
			this.selectLong = false
		},
		setLong() {
			this.selectedRange = 'popular'
			this.selectShort = false
			this.selectLong = true
		}
	},
	components: {
		rankingContent
	}
}
</script>

<style lang="scss" scoped>
.ranking-container {
	background: #fff;
	height: 334px;
    margin-bottom: 20px;
	&:hover {
		box-shadow: 1px 1px 2px #ccc;
	}
	.ranking-header {
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
		.tab {
			float: left;
			.tab-item {
				cursor: pointer;
				position: relative;
				display: inline-block;
				padding: 1px 0 2px;
				border-bottom: 1px solid transparent;
				margin-left: 12px;
				-webkit-transition: .2s;
				transition: .2s;
				-webkit-transition-property: border,color;
				transition-property: border,color;
			}
			.active {
				background-color: transparent;
				border-color: #00a1d6;
				color: #00a1d6;
			}	
		}
		.dropdown {
			float: right;
			position: relative;
			vertical-align: middle;
			background-color: #fff;
			cursor: default;
			padding: 0 2px 0 7px;
			height: 22px;
			width: 56px;
			line-height: 22px;
			border: 1px solid #ccd0d7;
			border-radius: 4px;
			&:hover {
				border-radius: 4px 4px 0 0;
				-webkit-box-shadow: rgba(0,0,0,.16) 0 2px 4px;
				box-shadow: 0 2px 4px rgba(0,0,0,.16);
			}
			.selected {
				display: inline-block;
    			vertical-align: top;
			}
			.dropdown-list {
				position: absolute;
				width: 100%;
				background: #fff;
				border: 1px solid #ccd0d7;
				border-top: 0;
				left: -1px;
				top: 22px;
				z-index: 10;
				border-radius: 0 0 4px 4px;
				.dropdown-item {
					cursor: pointer;
					margin: 0;
					padding: 3px 7px;
					&:hover {
						background: #ddd;
					}
				}
				.clicked {
					display: none;
				}
			}
		}
	}
}
</style>