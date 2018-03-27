<template>
    <div class="container">
        <slider :sliders="sliders" :titles="titles"></slider>
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
    data() {
        return {
            /*which page retrieve article list*/
            sourcePage: 'home',
            sliders: [
                {sourceUrl: '', imgUrl: '/static/grey.jpg'},
                {sourceUrl: '', imgUrl: '/static/grey.jpg'},
                {sourceUrl: '', imgUrl: '/static/grey.jpg'}
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
        @media screen and (max-width: 980px) {
            position: relative;
            width: 90%;
            margin: 0 20px;
        }  
        .split-line {
            margin: -5px 0 15px;
        }
    }
}

</style>