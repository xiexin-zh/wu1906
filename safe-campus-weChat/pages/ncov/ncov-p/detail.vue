<template>
  <view class="set u-page u-fx-ver u-fff">
    <view class="u-fx-ac u-fx-jsb set-info div-shadow">
      <view class="set-img">
        <image :src="detailInfo.photoUrl || '/mobile-img/person-auto.png'" alt="" />
      </view>
      <view class="u-fx-ver">
        <view class="set-name">{{detailInfo.userName}}</view>
        <view class="set-class u-font-2">{{detailInfo.gradeName}}{{detailInfo.className}}</view>
        <view class="set-class u-font-2">ID: {{detailInfo.id}}</view>
      </view>
      <view>
        <u-button v-if="!detailInfo.enableFever" type="success" size="mini">正常</u-button>
        <u-button v-else type="error" size="mini">发热</u-button>
      </view>
    </view>
    <view class="set-info div-shadow">
      <u-cell-group :border="false">
        <u-cell-item :arrow="false"
          title="体温"
          :value="`${detailInfo.temperature}℃`"
        />
        <u-cell-item :arrow="false"
          title="发热状态"
          :value="detailInfo.enableFever ? '发热' : '正常' "
          :value-style='{ color: detailInfo.enableFever ? "#fa3534" : "#19be6b"}'
        />
        <u-cell-item :arrow="false" title="上报人" :value="detailInfo.reportUserName" />
        <u-cell-item :arrow="false" title="上报时间" :value="detailInfo.reportTime" />
      </u-cell-group>
    </view>
  </view>
</template>

<script>
import { actions } from './store'
export default {
  components: {
  },
  data() {
    return {
      detailInfo: {
        temperature: '',
        feverMark: '',
        userName: '',
        className: '',
        userCode: '',
        reportPersonName: '',
        reportTime: '',
      },
      id: ''
    }
  },
  onLoad(options) {
    
  },
  async mounted() {
    this.id = this.$tools.getQuery().get('id')
    const res = await actions.getReportDetail(this.id)
    this.detailInfo = res.data
    this.detailInfo.reportTime = this.$tools.getDateTime(this.detailInfo.reportTime)
  }
}
</script>

<style lang="scss" scoped>
.set {
  .set-info {
    margin: 20rpx;
    padding: 30rpx;
    border-radius: 10rpx;
    .set-img {
      width: 150rpx;
      height: 150rpx;
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .set-name {
      font-size: 38rpx;
      font-weight: bold;
      color: $u-main-color;
      margin-bottom: 5rpx;
    }
    .set-class {
      color: $u-tips-color;
      margin-top: 10rpx;
    }
  }
  .div-shadow {
    box-shadow: 2rpx 2rpx 8rpx ￥u-border-color-dark;
    overflow: hidden;
  }
}
</style>
