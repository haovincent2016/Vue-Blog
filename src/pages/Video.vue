<template>
    <div class="background">
		<ul>
			<li v-for="category in categories" :key="category.id"> 
        		<video-row :category="category"></video-row>
			</li>
		</ul>
    </div>
</template>
<script>
import VideoRow from '@/components/video/VideoRow'
export default {
	data () {
		return {
			categories: [
				'Music Video', 'Movie', 'TV Series'
			]
		}
	},
	components: {
		VideoRow
	}
}
</script>
<style lang="scss" scoped>
.background {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 680px;
    margin-top: 20px;
}
</style>