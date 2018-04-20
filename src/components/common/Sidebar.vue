<template>
<div class="sidebar">
    <MiniSlider :content="content" :key="content.id"></MiniSlider>
    <TagList></TagList>
    <Ranking></Ranking>				
</div>
</template>

<script>
import MiniSlider from './MiniSlider'
import Ranking from './Ranking'
import TagList from './TagList'
export default {
	data () {
		return {
			currPage: 0,
			title: 'content',
			content: {
                title: 'books',
                type: 'book',
                list: [
                    {sourceUrl: '#', title: 'Harry Potter', desc: 'Harry Potter', imgUrl: '//i3.mifile.cn/a4/8e3584b6-3169-41c6-9356-939ec79aac2b'},
                    {sourceUrl: '#', title: 'Magazine', desc: 'Magazine', imgUrl: '//i3.mifile.cn/a4/T1R3WgBjKT1RXrhCrK.jpg'},
                    {sourceUrl: '#', title: 'Novel', desc: 'Novel', imgUrl: '//s01.mifile.cn/i/index/more-duokan.jpg'},
                    {sourceUrl: '#', title: 'On Sale', desc: 'On Sale', imgUrl: '//i3.mifile.cn/a4/T1dlVgBbbT1RXrhCrK.jpg'}
                ]
			}
		}
	},
	components: {
        MiniSlider,
        Ranking,
        TagList
	}
}
</script>

<style lang="scss" scoped>
</style>
