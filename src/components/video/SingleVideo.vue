<template>
<div class="video-container">
  <div id="dplayer"></div>
  <div class="danmaku-wrapper">
    <div class="danmaku-info">Total 100 items<i class="fa fa-bars"></i></div>
    <div class="danmaku-list">
      <div class="list-header">
        <span class="time">Time</span>
        <span class="content">Content</span>
        <span class="post">Post Time</span>
      </div>
      <ul class="list-content">
        <li class="list-item" v-for="(danmaku, index) in danmakus" :key="index">
          <span class="item-time">{{ danmaku.time | number }}</span>
          <span class="item-content">{{ danmaku.text }}</span>
          <span class="item-post">{{ danmaku.date | moment }}</span>
        </li>
      </ul>
    </div>
  </div>
  <!-- always show danmaku input row -->
  <div class="danmaku-post">
    <input class="danmaku-input" v-model="content" placeholder="Post danmaku here~">
    <div class="danmaku-button" @click="sendDanmaku">Send</div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
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
    dp.on('danmaku_send', this.getDanmakus)
    this.getDanmakus()
  },
  data () {
    return {
      id: '',
      options: {},
      danmakus: [],
      content: '',
      time: 0
    }
  },
  filters: {
    number: function(val) {
      return val.toFixed(1)
    },
    moment: function(date) {
      return moment(date).format('MM-DD, hh:mm')
    },
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
    },
    getDanmakus() {
      this.$http.get('/d/v2/', { params: { id: this.id }}).then(res => { 
        if(res.data.code == 0) {
          this.danmakus = res.data.danmaku
        }
       })
    },
    sendDanmaku() {
      //get current video playing time
      this.time = dp.video.currentTime
      if(this.content) {
        this.$http.post('/d/v2', { player: this.id, author: 'vincent', time: this.time, text: this.content, color: '#fff', type: 'right', token: 'lolnewtoken'}).then(res => {
          if(res.data.code == 0) {
            this.$notify({
              title: 'Success',
              type: 'success',
              message: 'you have sent danmaku~',
              position: 'top-left'
            })
            //draw danmaku into player
            let dan = {
              text: res.data.data.text,
              color: res.data.data.color,
              type: res.data.data.type,
              border: "2px solid #b7daff"
            }
            dp.danmaku.draw(dan)
            this.getDanmakus()
          } else {
            this.$notify({
              title: 'Warning',
              type: 'warning',
              message: 'failed to send danmaku~',
              position: 'top-left'
            })
          }
          this.content = ''
        })
      } else {
        this.$notify({
          title: 'Warning',
          type: 'warning',
          message: 'please write something first~',
          position: 'top-left'
        })
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
  display: flex;
  flex-direction: row;
  #dplayer {
    flex: 2.5;
  }
  .danmaku-wrapper {
    flex: 1;
    background: #fff;
    box-shadow: 1px 1px 2px #ccc;
    .danmaku-info {
      display: flex;
      height: 3rem;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: #666;
      .fa {
        margin-left: 0.6rem;
      }
    }
    .danmaku-list {
      margin: 0.5rem 1rem;
      .list-header {
        display: flex;
        font-size: 1.1rem;
        color: #777;
        margin: 0.3rem 0;
        .time {
          flex: 1;
        }
        .content {
          flex: 3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .post {
          flex: 2;
        }
      }
      .list-content {
        height: 27rem;
        overflow-y: auto;
        .list-item {
          display: flex;
          font-size: 1.1rem;
          color: #777;
          margin: 0.3rem 0;
          .item-time {
            flex: 1;
          }
          .item-content {
            flex: 3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-post {
            flex: 2;
          } 
        }
      }
    }
  }
  .danmaku-post {
    position: absolute;
    bottom: -2.5rem;
    left: 0;
    width: 100%;
    .danmaku-input {
      width: 65%;
      padding: 0.5rem 0.2rem;
      border: none;
      display: inline-block;
      font-size: 1.3rem;
      &:focus {
        outline: none;
        box-shadow: 1px 1px 2px #ccc;
      }
    }
    .danmaku-button {
      display: inline-block;
      color: #fff;
      cursor: pointer;
      text-align: center;
      border-radius: 4px;
      background-color: #00a1d6;
      border: 1px solid #00a1d6;
      padding: .5rem .8rem;
      font-size: 1.1rem;
    }
  }
  @media screen and (max-width: 420px) {
    flex-direction: column;
  }
}
</style>