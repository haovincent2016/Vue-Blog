<template>
<el-row>
    <el-col :span="8" :offset="8">
        <div class="grid-content bg-purple">
            Admin Panel
        </div>
    </el-col>
</el-row>
</template>

<script>
export default {
	data () {
		return {
			
		}
	},
	components: {
		
	}
}
</script>

<style lang="scss" scoped>
.el-row {
    margin: 20px 0;
    .bg-purple {
        background: #d3dce6;
        color: #fff;
        text-align: center;
        padding: 10px;
        font-size: 20px;
    }
}
</style>