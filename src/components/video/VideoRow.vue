<template>
    <div class="video-row">
        <div class="left-content">
            <RowTop :title="category"></RowTop>
            <RowContent :content="category"></RowContent>
        </div>
    </div>
</template>

<script>
import RowTop from './RowTop'
import RowContent from './RowContent'
export default {
    props: {
        category: {
            type: String
        }
    },
	data () {
		return {
			
		}
	},
	components: {
        RowTop,
        RowContent
	}
}
</script>

<style lang="scss" scoped>
.video-row {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    .left-content {
        float: left;
		width: 700px;
        background-color: #fff;
		margin-bottom: 50px;
        @media screen and (max-width: 420px) {
            width: 100%;
        }  
    }
    .right-content {
        float: right; 
		width: 260px;
		min-height: 900px;
		height: 900px;
		margin-bottom: 50px;
    }
}
</style>