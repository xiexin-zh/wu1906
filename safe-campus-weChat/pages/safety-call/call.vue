<template>
	<view class="u-fx-f1">
		  <u-collapse class="u-fx-f1 " :arrow="arrow" :accordion="accordion" :body-style='bodyStyle' :head-style='headStyle'>
				<u-collapse-item class='u-bd-b u-mar-b10'
				:open='true' 
				:item-style="itemStyle"   v-for="(item, index) in itemList" :key="index">
					<view slot='title-all' class="title-all u-main-color">
						<view class="text-cont">
							<view class="open-icon u-fx u-fx-ac">
								<!-- <u-icon label="uView" size="40" name="https://cdn.uviewui.com/uview/example/button.png"></u-icon> -->
								<u-icon name="arrow-down-fill" class="u-tips-color" size='2'></u-icon>
								<view class="u-mar-l">
									{{item.categoryName}}
								</view>
							</view>
							<view class="u-tips-color u-font-02">
								共{{ item.len }}条
							</view>
						</view>
					</view>
					<view class="collapse-item">
						<div class="list u-main-color u-fx-ac"  @click="showPop(el)" v-for="(el,index) in item.resourceList" :key="index">
							{{el.name}}
						</div>
					</view>
				</u-collapse-item>
			</u-collapse>
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
import { store, actions } from './store/index.js';
import freeAudio from './component/free-audio.vue'
export default {
	components:{
		freeAudio
	},
	name:'callIndex',
	computed: {
		userInfo: () => store.userInfo
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
			accordion: false,
			bofangActive:false,
      path: '',
			showPopup: false,
			itemStyle: {
				color: '#343434',
				marginTop: '5rpx',
				background: '#fff',
			},
			bodyStyle: {
				background: '#fff',
			},
			headStyle: {
				height:'98rpx',
				fontSize: '32rpx',
				background: '#fff',
				padding:'0rpx'
			},
			itemList: [],
      title: ''
		};
	},
	async mounted() {
    this._getRadioEmerg()
	},
	methods: {
    // 试听弹框
		showPop(item) {
      this.path =  item.url
      this.title = item.name
      this.showPopup = true
    },
    // 试听
		listening() {
			this.bofangActive = true
			this.$refs.audio.start()
    },
    // 暂停
		stop() {
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
        query: store.userInfo.schoolCode,
        data: data
      }
      await actions.playRadioSource(req)
      this.showPopup = false
      this.$tools.toast('播放成功')
    },
    // 获取区域
    async _getRadioEmerg() {
      const req = {
        name: '',
        schoolCode: store.userInfo.schoolCode
      }
      const res = await actions.getRadioEmerg(req)
      this.itemList = res.data.map(el=>{
        return {
          ...el,
          len: el.resourceList.length
        }
      })
    }
	}
};
</script>

<style lang="scss" scoped>
.title-all {
  width: 100%;
  height: 100%;
  padding: 0 32rpx;
  .text-cont {
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.collapse-item {
  .list {
    margin-left: 70rpx;
    margin-right: 70rpx;
    height: 97rpx;
    border-bottom: 1px solid #eee;
  }
}
.audioCont {
  .open {
    margin: 0 100rpx;
  }
}
</style>
