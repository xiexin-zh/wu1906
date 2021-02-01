<template>
  <view class="safe u-page u-fx-ver">
    <view class="time-box u-fx">
      <u-picker v-model="show" mode="time" @confirm="confirm"></u-picker>
      <view class="time-info u-font-3 u-shadow u-fx-jsb" @click="show = true">
        <view> 
          {{startDate }} 
          <text class="u-mar-l40"> {{startDate|getDay}}</text>
        </view>
        <image src="/mobile-img/safe-riqi.png" mode=""></image>
      </view>
    </view>
    <view class="info-box u-fx-f1 u-fx-ver u-shadow">
      <view class="info-title u-fx u-padd-t10 u-padd-b10"> 
        <view class="u-fx-f1" @click="check"> 
          <view class="info-num">{{indexList.waitNum}}</view>
          <view class="u-content-color u-font-01">待完成</view>
        </view>
        <view class="has-done u-fx-f1" @click="check"> 
          <view class="info-num">{{indexList.completedNum}}</view>
          <view class="u-content-color u-font-01">已完成</view>
        </view>
        <view class="u-fx-f1" @click="check"> 
          <view class="info-num">{{indexList.unCompletedNum}}</view>
          <view class="u-content-color u-font-01">未完成</view>
        </view>
      </view>
      <view class="ewm u-fx-f1 u-fx-ac-jc" @click="scanQRCode">
        <image src="/mobile-img/safe-saoma.png" mode=""></image>
      </view>
      <view class="u-fx-jc"> 
        <view class="info-btn u-mar-l20 u-mar-r20 u-fx-jc" @click="task(0)">
          <image class="u-mar-r20" src="/mobile-img/safe-xj.png" mode=""></image>
          <view class="u-font-02">巡检排班</view>
        </view>
        <view class="info-btn u-mar-l20 u-mar-r20 u-fx-jc" @click="task(1)">
          <image class="u-mar-r20" src="/mobile-img/safe-rw.png" mode=""></image>
          <view class="u-font-02">我的任务</view>
        </view>
      </view>
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
      indexList: {},
      startDate: this.$tools.getDateTime(new Date(), 'date').replace(/-/g, '/'),
      currentTmie: this.$tools.getDateTime(new Date(), 'second'),
      date: ''
    }
  },
  mounted () {
    wxApi.getConfig();
    this.date = this.$tools.getDateTime(new Date(), 'dateTime')
    this.safeIndexGet()
  },
  methods: {
    scanQRCode () {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        onlyFromCamera: true,
        success: (res) => {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          const schoolCode = result.split('&')[0]
          const code = result.split('&')[1].split('?')[0]
          const name = result.split('&')[1].split('?')[1]
          this.$tools.navTo({
            url: `./task?date=${this.date}&schoolCode=${schoolCode}&code=${code}`,
            title: name
          })
        }
      })
    },
    confirm (e) {
      this.startDate = `${e.year}/${e.month}/${e.day}`
      this.date = this.startDate ? `${this.startDate.replace( /\//g, '-')} ${this.currentTmie}` : `${this.startDate.replace( /\//g, '-')} 23:59:59`
      this.safeIndexGet()
    },
    async safeIndexGet () {
      const req = {
        date: this.date,
        schoolCode: store.userInfo.schoolCode
      }
      const res = await actions.getSafeIndex(req)
      this.indexList = res.data
    },
    check () {
      this.$tools.navTo({
        url:`./record?date=${this.date}`,
        title:'巡检记录'
      })
    },
    task (type) {
      const url = type ? 'my' : 'schedule'
      const title = type ? '我的任务' :  `巡检排班(${this.date.replace(/-/g, '/').substring(0,7)})`
      this.$tools.navTo({
        url: `./${url}?date=${this.date}`,
        title: title
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.u-page {
  background-color: #fff;
  color: $u-main-color;
  .time-box {
    height: 195rpx;
    background: url('/mobile-img/top.png') no-repeat;
    background-size: contain;
    background-color: $u-type-primary;
    position: relative;
    .time-info {
      position: absolute;
      bottom: 0;
      left: 50%;
      right: 50%;
      transform: translate(-50%, 50%);
      width: 90%;
      height: 98rpx;
      background-color: #fff;
      border-radius: $u-border-radius;
      align-items: center;
      padding: 0 40rpx 0 80rpx;
      color: $u-content-color;
      image {
        width: 50rpx;
        height: 50rpx;  
      }
    }
  }
  .info-box {
    margin: 80rpx 40rpx;
    padding: 88rpx 0;
    .info-title {
      height: 150rpx;
      text-align: center;
      .info-num {
        margin-bottom: 15rpx;
        font-weight: bolder;
        font-size: 52rpx;
      }
    }
    .info-btn {
      width: 276rpx;
      height: 88rpx;
      background-color: #E9F4FD;
      border-radius: $u-border-radius;
      align-items: center;
      image {
        width: 45rpx;
        height: 45rpx;
      }
    }
  }
}
.has-done {
  border-left: 1px solid $u-border-color;
  border-right: 1px solid $u-border-color;
}
.ewm {
  image {
    width: 400rpx;
    height: 400rpx;
  }
}
</style>