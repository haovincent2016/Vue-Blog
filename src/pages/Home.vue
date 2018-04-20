<template>
    <div class="container">
        <slider v-if="size === 1" :sliders="sliders" :titles="titles"></slider>
        <mt-swipe :auto="0" v-else>
            <mt-swipe-item v-for="banner in banners" :key="banner.id">
                <img :src="banner" />
            </mt-swipe-item>
        </mt-swipe>
        <div class="main-content">
            <div class="article-wrapper">
                <list :source="sourcePage"></list>
            </div>
            <div class="sidebar-wrapper">
                <sidebar></sidebar>
            </div>
        </div>
    </div>
</template>
<script>
import slider from '@/components/common/MainSlider'
import list from '@/components/blog/Articles'
import sidebar from '@/components/common/Sidebar'
import { loginJWT, logoutUser } from '@/helper/userHelper'
import { mapActions, mapGetters } from 'vuex'

export default {
    created() {
        this.checkDevice()
    },
    data() {
        return {
            /*screen size*/
            size: null,
            /*which page retrieve article list*/
            sourcePage: 'home',
            sliders: [
                {sourceUrl: '', imgUrl: '/static/morning.jpg'},
                {sourceUrl: '', imgUrl: '/static/hills.jpg'},
                {sourceUrl: '', imgUrl: '/static/waterfall.jpg'}
            ],
            banners: [
                '/static/banners/banner1.jpg',
                '/static/banners/banner2.jpg',
                '/static/banners/banner3.jpg',
            ],
            titles: [
                { title: 'Slider one', sub: 'subtitle one' },
                { title: 'Slider two', sub: 'subtitle two' },
                { title: 'Slider three', sub: 'subtitle three' }
            ]
        }
    },
    methods: {
        //check if user browse on mobile
        checkDevice() {
            if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                this.size = 0
            } else {
                this.size = 1
            }
        },
    },
    components: {
        slider,
        list,
        sidebar
    }
}
</script>
<style lang="scss" scoped>
.mint-swipe {
    height: 25em;
    margin-bottom: 1em;
}
.container {
    position: relative;
    width: 100%;
    max-width: 980px;
    display: flex;
    flex-direction: column;
    .main-content {
        display: flex;
        justify-content: space-between;
        margin: 20px 0 40px;
        .article-wrapper {
            flex: 3;
            background: #fff;
            margin-top: 20px;
            border-top: 1px solid #00a1d6;
            padding: 25px 25px 0 25px;
            &:hover {
                box-shadow: 1px 1px 2px #ccc;
            }
            @media screen and (max-width: 960px) {
                margin: 0 5px;
            }
        }
        .sidebar-wrapper {
            flex: 1;
            margin-left: 20px;
            @media screen and (max-width: 960px) {
                display: none;
            }
        }
    }
}

</style>