<template>
	<div class="slider-title">
		<div class="left-side">
			<ul>
				<li class="slider-item"
					v-for="(item, index) in titles"
					:key="item.id"
					:class="{activeitem: index == currentHover }"
					@mouseover="setHover(index)"
					@mouseleave="currentHover = currentDot">
					<h4>{{item.title}}</h4>
					<p v-show="index == currentHover">{{item.sub}}</p>
				</li>
			</ul>
		</div>
		<div class="slider">
			<span
				@click="slideLeft()"
				class="slide-left">
				<i class="fa fa-chevron-left fa-2x fa-fw icon-chevron-left"></i>
			</span>
			<span
				@click="slideRight()"
				class="slide-right">
				<i class="fa fa-chevron-right fa-2x fa-fw icon-chevron-right"></i>
			</span>
			<transition name="fade">
			<div class="slide"
				v-if="index === current"
				v-for="(item, index) in sliders"
				:key="index">
				<img :src="item.imgUrl" alt="slider" />	
			</div>
			</transition>
			<ul class="dot-list">
				<li class="dot-item"
					v-for="(item, index) in 3"
                    :key="item.id"
					:class="{active: index == currentDot}"
					@click="setHover(index)"
					>
					<span class="dot"></span>
				</li>
			</ul>	
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			prev: '',
			current: 0,
			direction: 1,
			currentDot: 0,
			currentHover: 0,
			showSub: false
		}
	},
	props: {
		sliders: {
			type: Array,
			required: true
		},
		titles: {
			type: Array,
			required: true
		}
	},
	methods: {
		slideLeft() {
			const last = this.sliders.length - 1
			if(this.current > 0) {
				this.current -= 1
				this.currentHover -= 1
				this.currentDot -= 1
			} else {
				this.current = last
			}
		},
		slideRight() {
			const last = this.sliders.length - 1
			if(this.current < last) {
				this.current +=  1
				this.currentHover +=  1
				this.currentDot +=  1
			} else {
				this.current = 0
				this.currentHover = 0
				this.currentDot = 0
			}
		},
		autoplay() {
			clearInterval(this.prev)
			this.prev = setInterval(() => {
				this.slideRight()
			}, 6000)
		},
		setHover(index) {
			this.currentHover = index
			this.currentDot = index
			this.current = index
		}
	}
}
</script>

<style lang="scss" scoped>
.slider-title {
	position: relative;
	width: 1226px;
	height: auto;
	margin: 0 auto;
	.left-side {
		position: absolute;
		left: 2%;
		top: 22%;
		width: 200px;
		height: auto;
		padding: 20px 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 10;
		ul {
			.activeitem {
				color: #fff !important;
			}
			.slider-item {
				width: 100%;
				height: 60px;
				font-size: 14px;
				color: lightgrey;
				text-align: center;
				cursor: pointer;
				padding: 5px 0;
				&:hover {
					color: #fff;
					padding-left: 3px;
				}
			}
		}
	}
}
.slider {
	position: relative;
	width: 1226px;
	height: 460px;
	z-index: 0;
}

.slide-left {
	display: block;
	position: absolute;
	left: 235px;
	top: 50%;
	width: 40px;
	height: 70px;
	margin-top: -35px;
	z-index: 10;
	cursor: pointer;
	&:hover{
		background: rgba(0, 0, 0, 0.3);
	}
}

.slide-right {
	display: block;
	position: absolute;
	right: 250px;
	top: 50%;
	width: 40px;
	height: 70px;
	margin-top: -35px;
	z-index: 10;
	cursor: pointer;
	&:hover{
		background: rgba(0, 0, 0, 0.3);
	}
}

.slide {
	position: absolute;
	left: 0;
	top: 0;
	width: 1226px;
	height: 460px;
	transition: all 0.3s;
	img {
		width: 980px;
		height: 100%;
	}
}

.dot-list {
	position: absolute;
	bottom: 10px;
	right: 250px;
	z-index: 10;
	.active {
		.dot {
			background-color: #b0b0b0 !important;
		}
	}
	.dot-item {
		display: inline-block;
		width: 10px;
		height: 10px;
		padding: 10px;
		margin: 0 2px;
		cursor: pointer;
		.dot {
			display: block;
			width: 6px;
			height: 6px;
			border: 2px solid #f5f5f5;
			border-radius: 6px;
			overflow: hidden;
			background-color: transparent;
			transition: all .5s;
			&:hover {
				background-color: #b0b0b0;
			}
		}
	}
}

.icon-chevron-left, .icon-chevron-right {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 30px;
	height: 30px;
	margin-left: -15px;
	margin-top: -15px;
	color: #ecf0f1;
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .5s;
}
.fade-enter, .fade-leave-active {
	opacity: 0;
}
</style>