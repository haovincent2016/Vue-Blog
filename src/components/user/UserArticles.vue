<template>
    <div class="article-wrapper">
		<list :source="sourcePage"></list>			
    </div>
</template>

<script>
import list from '@/components/blog/Articles'
export default {
	data () {
		return {
			sourcePage: 'author'
		}
	},
	components: {
		list
	}
}
</script>

<style lang="scss" scoped>
.article-wrapper {
	margin-top: 5px;
	padding: 15px 25px 50px;
    margin-bottom: 40px;
}
</style>