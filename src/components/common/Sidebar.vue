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
                    {sourceUrl: 'http://www.duokan.com/book/115222', title: '哈利·波特与魔法石', desc: '哈利波特来了', imgUrl: '//i3.mifile.cn/a4/8e3584b6-3169-41c6-9356-939ec79aac2b', type: 0},
                    {sourceUrl: 'http://www.duokan.com/special/7812', title: '特价专区', desc: '精选畅销好书，特价促销，天天更新，天天特价！', price: '限时优惠', imgUrl: '//i3.mifile.cn/a4/T1dlVgBbbT1RXrhCrK.jpg', type: 0},
                    {sourceUrl: 'http://www.duokan.com/list/9-1', title: '杂志专区', desc: '纸媒杂志＋互联网杂志，你想看的这都有！', price: '同步新刊上线', imgUrl: '//i3.mifile.cn/a4/T1R3WgBjKT1RXrhCrK.jpg', type: 0},
                    {sourceUrl: 'http://www.duokan.com/list/1-1?from=xiaomi', desc1: '海量好书，享受精品阅读时光', desc2: '漂亮的中文排版，千万读者选择！', btnTxt: '前往多看阅读', price: '限时优惠', imgUrl: '//s01.mifile.cn/i/index/more-duokan.jpg', type: 0}
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
.sidebar {
    width: 280px;
    margin: 0 auto;
    float: right;
    @media screen and (max-width: 960px) {
        display: none;
    }
}
</style>
