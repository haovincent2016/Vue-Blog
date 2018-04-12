<template>
    <div class="video-container">
        <div id="dplayer"></div>
    </div>
</template>

<script>
import DPlayer from '../../../node_modules/dplayer/dist/DPlayer.min.js'
import '../../../node_modules/dplayer/dist/DPlayer.min.css'

let dp
export default {
    created() {
        this.checkVideo()
    },
    mounted() {
        dp = new DPlayer({
            container: document.getElementById('dplayer'),
            logo: '/static/xiaomai.png',
            screenshot: true,
            video: this.options,
            danmaku: {
                id: this.id,
                api: 'http://localhost:3001/d/',
                token: 'lolnewtoken',
                maximum: 100,
                user: 'vincent',
                bottom: '15%'
            }
        })
    },
	data () {
		return {
            id: '',
            options: {}
		}
    },
    methods: {
        checkVideo() {
            let index = this.$route.params.id
            switch(index) {
                case '1': 
                    this.id = '128asc79as9ax113'
                    this.options = { 
                        quality: [{
                            name: '1080P',
                            url: '/static/videos/so good 1080P.mp4',
                            type: 'auto'
                        }, {
                            name: '720P',
                            url: '/static/videos/so good 720P.mp4',
                            type: 'auto'
                        }],
                        defaultQuality: 0
                    }
                    break
                case '2':
                    this.id = '128asc79as9ax115'
                    this.options = { 
                        quality: [{
                            name: '1080P',
                            url: '/static/videos/see you again 1080P.mp4',
                            type: 'auto'
                        }, {
                            name: '720P',
                            url: '/static/videos/see you again 720P.mp4',
                            type: 'auto'
                        }],
                        defaultQuality: 0
                    }
                    break
                case '3':
                    this.id = '128asc79as9ax118'
                    this.options = { 
                        quality: [{
                            name: '1080P',
                            url: '/static/videos/this christmas 1080P.mp4',
                            type: 'auto'
                        }, {
                            name: '720P',
                            url: '/static/videos/this christmas 720P.mp4',
                            type: 'auto'
                        }],
                        defaultQuality: 0
                    }
                    break
                case '4':
                    this.id = '128asc79as9ax110'
                    this.options = { 
                        quality: [{
                            name: '1080P',
                            url: '/static/videos/one call away 1080P.mp4',
                            type: 'auto'
                        }, {
                            name: '720P',
                            url: '/static/videos/one call away 720P.mp4',
                            type: 'auto'
                        }],
                        defaultQuality: 0
                    }
                    break
                default:
                    this.id = '128asc79as9ax11'
                    this.options = {}
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.video-container {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    margin-top: 20px;
    .dplayer {
        width: 100%;
    }
}
</style>