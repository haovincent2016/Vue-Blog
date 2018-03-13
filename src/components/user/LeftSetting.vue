<template>
    <div class="aside">
	    <ul>
            <li v-for="item in menu" :key="item.id">
                <router-link :to="{ path: item.link }">
                    <a href="/settings/basic">
                        <div class="setting-icon">
                            <i :class="item.icon"></i>
                        </div> 
                        <span>{{ item.name }}</span>
                    </a>
                </router-link>
            </li>
        </ul>		
    </div>
</template>

<script>
export default {
	data () {
		return {
			menu: [
                { name: 'basic settings', icon: 'fa fa-cog', link: '/setting/basic' },
                { name: 'account', icon: 'fa fa-file-text-o', link: '/setting/account' }
            ]
		}
	}
}
</script>

<style lang="scss" scoped>
.aside {
    position: fixed;
    top: 0;
    bottom: 0;
    margin: 86px 0 0;
    padding: 0 0 30px;
    width: 250px;
    overflow: auto;
    ul {
        background-color: white; 
        &:hover {
            box-shadow: 1px 1px 2px #ccc;
        }
        li {
            line-height: 20px;
            a {
                padding: 10px 15px;
                font-size: 15px;
                display: block;
                cursor: pointer;
                &:hover, &:active {
                    background-color: #f0f0f0;
                    border-radius: 4px;
                }
            }
        }
    }
}
.setting-icon {
    margin-right: 15px;
    width: 35px;
    height: 35px;
    text-align: center;
    color: #fff;
    background-color: #a0a0a0;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
    .fa {
        padding-top: 10px;
    }
}
</style>