<template>
    <div class="row-wrapper">
        <div class="top-title">
            <a href="" class="name">{{ title }}</a>
            <a href="" target="_blank" class="top-more">More
                <i class="fa fa-chevron-right"></i>
            </a>
            <div @click="refreshList" class="top-update">
                <i v-if="!loading" class="fa fa-refresh"></i>
                <i v-if="loading" class="fa fa-refresh fa-spin fa-fw"></i>
                <span class="info">refresh</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    },
	data () {
		return {
			loading: false
		}
	},
    methods: {
        refreshList() {
            this.loading = true
            const that = this
            setTimeout(function() {
                that.loading = false
            }, 500);
        }
    },
	components: {
		
	}
}
</script>

<style lang="scss" scoped>
.row-wrapper {
    margin-top: 10px;
    padding: 0 20px;
    height: 30px;
    .top-title {
        padding: 0 0 15px;
        .name {
            font-size: 20px;
            line-height: 24px;
            font-weight: 400;
            margin-right: 20px;
            float: left;
            color: #222;
        }
        .top-update {
            float: right;
            cursor: pointer;
            background-color: #fff;
            border: 1px solid #ccd0d7;
            border-radius: 4px;
            height: 22px;
            padding: 0 10px;
            &:hover {
                box-shadow: 1px 1px 2px #ccc;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                line-height: 22px;
                margin-left: 4px;
            }
            .fa-refresh {
                margin-top: 5px;
            }
        }
        .top-more {
            float: right;
            width: 52px;
            height: 22px;
            line-height: 22px;
            background-color: #fff;
            border: 1px solid #ccd0d7;
            color: #555;
            border-radius: 4px;
            text-align: center;
            margin: 0 0 0 10px;
            &:hover {
                box-shadow: 1px 1px 2px #ccc;
            }
        }
    }
}
</style>