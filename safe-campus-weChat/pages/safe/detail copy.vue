<template>
  <view>
		<scroll-view  scroll-y="true" class="scroll-h ">
			<view class="add-top u-padd-t30 u-padd-r20 u-padd-l20" >
				<view class="add-info u-padd-20 u-fx-jsb u-shadow">
					<view class="u-fx">
						<view 
              :class="['add-name', 'u-mar-r20', 'u-padd-r20', 'u-padd-l20', detailInfo.taskType === '1' ? 'day-yes': detailInfo.taskType === '2' ? 'equip-yes' : detailInfo.taskType === '3' ? 'guid-yes' : '']"> 
              {{ detailInfo.taskType === '1' ? '日常巡查' : detailInfo.taskType === '2' ? '设备巡查' : '安全护导'  }} 
            </view>
            <view class="u-fx-ver u-fx-jsa"> 
							<view class="u-font-1 u-content-color"> {{detailInfo.taskName}}<span class="u-font-02">({{detailInfo.userName}})</span> </view>
              <view class="u-font-01 u-tips-color" v-if="detailInfo.timeType === '1'">{{detailInfo.startTime | gmtToDate('time')}} - {{detailInfo.endTime | gmtToDate('time')}}</view>
              <view class="u-font-01 u-tips-color" v-if="detailInfo.timeType === '2'">
                {{ detailInfo.year }}-第{{ detailInfo.dateNum }}{{
                  detailInfo.taskTimeType === '2' ? '周'
                  : detailInfo.taskTimeType === '3' ? '月' 
                  : detailInfo.taskTimeType === '4' ? '季度' : ''
                }}任务
              </view>
						</view>
					</view>
					<view class="add-status">
						<image 
              :src="detailInfo.taskType === '1' && detailInfo.state === '1' ? '/mobile-img/safe-rcywc.png' : 
                    detailInfo.taskType === '1' && detailInfo.state === '0' ? '/mobile-img/safe-rcdwc.png' : 
                    detailInfo.taskType === '2' && detailInfo.state === '1' ? '/mobile-img/safe-sbywc.png' : 
                    detailInfo.taskType === '2' && detailInfo.state === '0' ? '/mobile-img/safe-sbdwc.png' : 
                    detailInfo.taskType === '3' && detailInfo.state === '1' ? '/mobile-img/safe-hdywc.png' : 
                    detailInfo.taskType === '3' && detailInfo.state === '0' ? '/mobile-img/safe-hddwc.png' : ''
              "
              ></image>
					</view>
				</view>
			</view>
      <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
        <view class="u-font-1"> {{ title }} </view>
        <view v-if="detailInfo.state === '1'"> {{ state }} </view>
      </view>
			<view class="add-content u-fx-ver u-bg-fff">
        <view class="add-item u-padd-20 u-fx-jsb u-bd-b" v-for="list in detailInfo.checkList" :key="list.id">
          <view class="u-fx-f1">{{list.name}}</view>
          <u-switch class="u-mar-l20" v-if="detailInfo.state === '1'" :value="list.state === '1'" disabled :size="30"></u-switch>
        </view>
			</view>
       <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
        <view class="u-font-1"> 巡检报告</view>
      </view>
      <view class="add-content u-fx-ver u-bg-fff">
        <view class="u-bd-b u-padd-20">
          <view>照片：
						<image v-for="(img,index) in detailInfo.photoUrls" :key="index" :src="img" mode=""></image>
					</view>
        </view>
        <view class="u-bd-b u-padd-20 ">
          <view>备注：{{detailInfo.remark}}</view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20 ">
        <view>位置：{{detailInfo.location}}</view>
      </view>
			</view>
		</scroll-view>
    <view class="footer-btn u-fx-ac" v-if="show">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="scanQRCode"
      >
        扫码巡检
      </u-button>
    </view>
  </view>
</template>

<script>
import wxApi from '@u/wxApi'
import wx from 'weixin-js-sdk'
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
      show: false,
      detailInfo: {},
      title: '',
      state: ''
    }
  },
  mounted () {
    wxApi.getConfig();
    this.addId = this.$tools.getQuery().get('taskId')
		this.addCode = this.$tools.getQuery().get('code')
    this.taskResultGet()
  },
  methods: {
    async taskResultGet () {
      const res =await actions.getTaskResult(this.addId)
      this.detailInfo = res.data
      this.title = res.data.taskType === '1' ? '巡检项' : res.data.taskType === '2' ? '检查设备' : '护导详情'
      this.state = res.data.taskType === '1' ? '不通过/通过' : '异常/正常'
      this.show = this.addCode === store.userInfo.userCode && res.data.state !== '1'
    },
    scanQRCode () {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        onlyFromCamera: true,
        success: (res) => {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          const schoolCode = result.split('&')[0].substring(11)
          const code = result.split('&')[1].substring(5)
          this.$tools.navTo({
            url: `./task?date=${this.date}&schoolCode=${schoolCode}&code=${code}`,
            title: '巡查任务'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 120rpx);
  .add-status {
    width: 100rpx;
    height: 100rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
 .content-title {
   height: 90rpx;
   align-items: center;
  }
  .add-content {
    background-color: #fff;
    image {
      width: 120rpx;
      height: 120rpx;
    }
  }
  .add-top {
    height: 200rpx;
  }
 .add-info {
    height: 170rpx;
    background-color: #fff;
    align-items: center;
    border-radius:  $u-border-radius;
    .add-name {
      height: 98rpx;
      width: 98rpx;
      line-height: 36rpx;
      padding-top: 15rpx;
      border-radius:  $u-border-radius;
      background-color: $u-type-primary-disabled;
      color: $u-type-primary;
    }
  }
  .add-item {
    align-items: center;
  }
}
</style>
