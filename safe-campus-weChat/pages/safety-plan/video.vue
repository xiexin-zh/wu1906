<template>
	<view class="u-fx-ver u-type-white-bg">
    <u-select v-model="show" :list="list" @confirm="confirm"></u-select>
    <view class="u-fx-ac u-padd">
      <view class="u-fx-f1 u-fx-je" @click="show=true">
        {{radio}}
      </view>
      <view class="rit-icon"></view>
    </view>
    <view class="u-fx-f1">
      <view class="video" style="width: 100%;height: 100%;"></view>
    </view>
	</view>
</template>
<script>
	import {
		store,
		actions
	} from './store/index.js';
	export default {
		components: {},
		computed: {
			userInfo: () => store.userInfo
		},
		data() {
			return {
        show: false,
        radio: 0,
        list: [],
        url: ''
			}
		},
		async mounted() {
      this.init()
      this.detailId = this.$route.query.id
      this._getTemplateVideo()
    },
		methods: {
      async _getTemplateVideo() {
        const res = await actions.getTemplateVideo({emergencyId: this.detailId})
        this.list = res.data.map(el => {
          return {
            ...el,
            value: el.deviceId,
            label: el.name
          }
        })
        if(res.data.length > 0){
          this.radio = res.data[0].name
          this.url = res.data[0].streamUrl
          this.init()
        }
      },
      confirm(e) {
        this.list.forEach(el => {
          if(el.deviceId === e.value){
            this.url = el.streamUrl
            this.init()
          }
        })
      },
      // 初始化播放器
      init(){
        new ckplayer({
          container: '.video', //“#”代表容器的ID，“.”或“”代表容器的class
          variable: 'player', //播放函数名称，该属性必需设置，值等于下面的new ckplayer()的对象
          autoplay: 'autoPlay',
          html5m3u8: true,
          flashplayer: true,
          // video: 'https://hls01open.ys7.com/openlive/9adda642c1f8481aa3db4b012dd661ea.m3u8'//视频地址
          video: this.url//视频地址
        })
      }
    }
	}
</script>
<style lang="scss" scoped>
.video {
  background-color: red;
}
</style>
