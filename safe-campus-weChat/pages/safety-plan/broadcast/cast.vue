<template>
	<view class="cast home u-page">
		<!-- <no-data msg="暂无数据" ></no-data> -->
		<scroll-view scroll-y="true" class="scroll-h u-mar-t20"  @scrolltolower="loadMore">
			<u-cell-group >
        <u-cell-item lable='' 
        v-for="(item,index) in list"
        :key="index"
        @click="play(item)"
        class="u-main-color u-bg-fff" :arrow="false">
          <view class="u-fx" slot="title">
            <text class=" u-font-1">{{item.name}}</text>
          </view>
        </u-cell-item>
      </u-cell-group>
		</scroll-view>
		<u-popup v-model="showPopup" mode="bottom">
			<view class="audioCont u-bg-fff u-padd-40 u-fx-ver u-fx">
        <view class="u-fx-ac-jc  u-type-primary">{{ title }}</view>
        <!-- https://ext.dcloud.net.cn/plugin?id=3372 -->
        <free-audio ref="audio" startPic='http://canpointtest.com/mobile-img/CANPOINT.png' 
        endPic='http://canpointtest.com/mobile-img/CANPOINT.png'  :url='path'></free-audio>
        <view class="icon u-fx-jc">
          <view class="list u-fx-ac-jc" :class="bofangActive?'u-type-primary':'u-tips-color'" @click="listening">
            <u-icon class="u-mar-b10"  name="http://canpointtest.com/mobile-img/icon_shiting.png"  size='30'></u-icon>
            试听
          </view>
          <view class="list open u-fx-ac-jc" @click="playing">
            <u-icon name="http://canpointtest.com/mobile-img/icon_bofang.png"  size='120'></u-icon>
          </view>
          <view class="list u-fx-ac-jc " :class="bofangActive?'u-tips-color':'u-type-primary '" @click="stop">
            <u-icon class="u-mar-b10" name="http://canpointtest.com/mobile-img/icon_zanting.png"  size='30'></u-icon>
            暂停
          </view>
        </view>
			</view>
		</u-popup>
	</view>
</template>
<script>
import freeAudio from '../component/free-audio.vue'
import { store, actions } from '../store/index.js';
export default {
	components:{
			freeAudio
	},
	name:'cast1',
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
  },
  props: {
    areaList: {
      type: Array,
      default: function() {
        return []
      }
    },
    chooseList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
	data() {
		return {
			arrow: true,
			currentIndex: '1',
			bofangActive:false,
			path: '',
      showPopup: false,
      list: [],
      title: ''
		};
	},
	async mounted() {
    this.detailId = this.$route.query.id
    console.log('this.detailId',this.detailId)
    this._getTemplateRadio()
	},
	methods: {
    async _getTemplateRadio() {
      const res = await actions.getTemplateRadio({emergencyId: this.detailId})
      this.list = res.data.audioList
    },
		//播放
    play(item){
      this.path =  item.url
      this.title = item.name
      this.showPopup = true
    },
    //试听
    listening(){
      this.bofangActive = true
      this.$refs.audio.start()
    },
    //暂停
    stop(){
      this.bofangActive = false
      this.$refs.audio.stop()
    },
     // 播放
    async playing (){
      if (this.chooseList.length === 0) {
        this.$tools.toast('请选择区域')
        return
      }
      let tms = []
      for (let i = 0; i < this.areaList.length; i++) {
        for (let y = 0; y < this.chooseList.length; y++) {
          if (this.areaList[i].code === this.chooseList[y]) {
            tms = tms.concat(this.areaList[i].ipList)
          }
        }
      }
      const data = {
        level: '1',
        messageContents: [this.path],
        msgType: '1',
        tms: tms.filter((item, index) => {
          return tms.indexOf(item, 0) === index
        })
      }
      const req = {
        query: this.userInfo.schoolCode,
        data: data
      }
      await actions.playRadioSource(req)
      this.showPopup = false
      this.$tools.toast('播放成功')
    },
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
	}
};
</script>

<style lang="scss" scoped>
.home {
	.scroll-h{
		height: calc(100vh - 100rpx);
		.u-cell{
    box-shadow: 0rpx 10rpx 30rpx 0rpx rgba(9, 28, 62, 0.06);
    border-radius: 8rpx;
		}
		/deep/ .u-cell-item-box{
					// background: transparent!important;
		}
	}
	.audioCont{
		.open{
			margin: 0 100rpx;
		}
	}
}
</style>
