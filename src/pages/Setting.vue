<template>
    <div class="container">
	    <left-setting></left-setting>
        <router-view></router-view>		
    </div>
</template>

<script>
import leftSetting from '@/components/user/LeftSetting'
import basic from '@/components/user/BasicSetting'
export default {
	data () {
		return {
			
		}
	},
	components: {
        leftSetting,
        basic
	}
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
	position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    @media screen and (max-width: 420px){
        flex-direction: column;
    }
}
</style>