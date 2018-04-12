<template>
    <ul v-if="this.content === 'Music Video'" class="row-content">
        <li v-for="(videoId, index) in videoIds" 
            :key="videoId.id"
            @mouseover="changePos(index, true)"
            @mouseleave="changePos(index, false)" 
            class="row-item"
            >
            <div class="video">
                <div class="mask" v-if="currentIndex === index">
                    <div class="btn-list">
                        <button class="btn-watch" @click="openVideo(index)">Watch</button>
                        <button class="btn-ytd" @click="openYtd(index)">Youtube</button>
                    </div>
                </div>
                <youtube :video-id="videoId" :player-width="320" :player-height="200"></youtube>
            </div>
        </li>
    </ul>
</template>

<script>
import { getIdFromURL, getTimeFromURL } from 'vue-youtube-embed'
export default {
    mounted() {
       this.initialSetup() 
    },
    props: {
        content: {
            type: String
        }
    },
	data () {
		return {
            videoIds: [],
            player: null,
            currentIndex: -1,
            topPos: 60,
            leftPos: 21,
            urls: [],
		}
    },
    methods: {
        ready (player) {
            this.player = player
        },
        initialSetup() {
            let urls = [
                'https://www.youtube.com/watch?v=IoBP24I2lwA',
                'https://www.youtube.com/watch?v=RgKAFK5djSk',
                'https://www.youtube.com/watch?v=hsh54g9JmC0',
                'https://www.youtube.com/watch?v=BxuY9FET9Y4'
            ]
            this.urls = urls
            for (let i = 0; i < urls.length; i++) {
                this.videoIds.push(getIdFromURL(urls[i]))
            }
        },
        changePos(index, state) {
            if(state) {
                this.currentIndex = index
            } else {
                this.currentIndex = -1
            }
        },
        openYtd(index) {
            window.open(this.urls[index], '_blank')
        },
        openVideo(index) {
            let i = index + 1
            this.$router.push({ path: `video/${i}` })
        },
        stop () {
            this.player.stopVideo()
        },
        pause () {
            this.player.pauseVideo()
        }
    },
	components: {
		
	}
}
</script>

<style lang="scss" scoped>
.row-content {
    padding-left: 15px;
    .row-item {
        float: left;
        margin: 12px 6px; 
        .video {
            position: relative;
            .mask {
                width: 320px;
                height: 190px;
                background: #333;
                opacity: 0.7;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 100;
                .btn-list {
                    text-align: center;
                    margin-top: 135px;
                    .btn-watch {
                        font-size: 15px;
                        font-weight: 600;
                        padding: 6px 12px;
                        color: #00a1d6;
                        border: 2px solid #00a1d6;
                        border-radius: 5px;
                        background: none;
                        cursor: pointer;
                        &:hover {
                            background: #00a1d6;
                            color: #fff;
                        }
                    }
                    .btn-ytd {
                        margin-left: 5px;
                        font-size: 15px;
                        font-weight: 600;
                        padding: 6px 12px;
                        color: #f4424e;
                        border: 2px solid #f4424e;
                        border-radius: 5px;
                        background: none;
                        cursor: pointer;
                        &:hover {
                            background: #f4424e;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>