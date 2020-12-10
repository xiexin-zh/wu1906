<template>
  <div class="video">
    <div v-if="playsinline" id="video-dialog" @click="closeVideo">
      <div class="video-close" @click="playsinline = false"></div>
      <div
        ref="videoPlayer"
        v-video-player:myVideoPlayer="playerOptions"
        class="video-player-box"
        :playsinline="playsinline"
      ></div>
    </div>

    <img class="banner-top" src="../assets/img/banner_spzq.png" alt="" />
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <el-row :gutter="40">
          <el-col
            v-for="(video, index) in videoList"
            :key="index"
            :xs="12"
            :sm="8"
            :lg="8"
            class="box-shadow u-hand"
            @click.native="onPlayerPlay(video.videoUrl)"
          >
            <div class="video-hover u-of">
              <img class="video-img" :src="video.url" alt="" />
            </div>
            <div class="u-fx u-fx-ac u-padd-l10">
              <ul>
                <li class="u-te font-title u-mar-t10">
                  {{ video.title }}
                </li>
                <li class="u-te level-title">{{ video.levelTitle }}</li>
              </ul>
              <div></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Video',
  async asyncData({ $axios }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getVideo?page=1&size=20`)
    return { videoList: res.data.data }
  },
  data() {
    return {
      playsinline: false,
      playerOptions: {
        // 播放器配置
        muted: false, // 是否静音
        width: '800px',
        height: '500px',
        loop: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        sources: [
          {
            type: 'video/mp4',
            src: '',
          },
        ],
        poster: '', // 封面图
        controlBar: {
          volumePanel: {
            inline: false, // 音量调节是否水平
          },
          currentTimeDisplay: true, // 当前播放位置
          timeDivider: false, // 时间分割线
          durationDisplay: true, // 总时间
          progressControl: true, // 进度条
          remainingTimeDisplay: true, // 剩余时间
          fullscreenToggle: true, // 全屏按钮
        },
      },
      videoList: [],
    }
  },
  computed: {
    ...mapState('home', ['title']),
  },
  mounted() {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
      this.playerOptions.width = '375px'
      this.playerOptions.height = '300px'
    }
  },
  methods: {
    onPlayerPlay(url) {
      this.playerOptions.sources[0].src = url
      this.playsinline = true
    },
    closeVideo($event) {
      if ($event.target.id === 'video-dialog') {
        this.playsinline = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.video-img {
  width: 100%;
  display: block;
  height: 3.2rem;
}
#video-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9998;
}
.video-hover {
  img {
    transform: scale(1);
    transition: all 0.5s ease-in-out;
  }
  &::before {
    width: 100%;
    height: 100%;
    z-index: 33;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    background: url(../assets/img/link-icon.png) no-repeat center, url(../assets/img/video-on.png) no-repeat center;
    background-size: 140px 140px, 40px 40px;
    animation: move 2s ease infinite;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
.video-hover:hover {
  img {
    transition: all 0.5s ease-in-out;
    transform: scale(1.2);
  }
}
</style>
