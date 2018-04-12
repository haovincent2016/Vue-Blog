<template>
    <div class="container">
        <slider v-if="size > 0" :sliders="sliders" :titles="titles"></slider>
        <mt-swipe :auto="0" v-else>
            <mt-swipe-item v-for="banner in banners" :key="banner.id">
                <img :src="banner" />
            </mt-swipe-item>
        </mt-swipe>
        <div class="left-column">
            <div class="split-line"></div>
            <list :source="sourcePage"></list>
        </div>
        <sidebar></sidebar>
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
        if(window.screen.width > 420) {
            this.size = 1
        } else {
            this.size = 0
        }
    },
    data() {
        return {
            /*screen size*/
            size: -1,
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
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    .left-column {
        padding: 0 15px 15px;
        background-color: #fff;
        width: 650px;
        position: absolute;
        margin: 20px 0 40px;
        border-top: 1px solid #00a1d6;
        &:hover {
            box-shadow: 1px 1px 2px #ccc;
        }
        @media screen and (max-width: 420px) {
            position: relative;
            width: 80%;
            margin: 0 20px;
        }  
        .split-line {
            margin: -5px 0 15px;
        }
    }
}

</style>