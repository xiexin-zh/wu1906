<template>
  <view class="sign-card">
    <u-section class="sign-title" color="#2979ff" font-size="34" title="补卡" :bold="false" :right="false"></u-section>
      <view class="u-fx u-fx-ac sign-type">
        <view class="sign-text">补卡类型:</view>
        <view class="u-fx-f1">
          <u-radio-group v-model="signType" class="u-fx" >
            <u-radio name="1" shape="circle">午间补卡</u-radio>
            <u-radio name="2" class="sign-left" shape="circle">晚间补卡</u-radio>
          </u-radio-group>
        </view>
      </view>
      <view class="u-fx u-fx-ac sign-type">
        <view class="sign-text">进出方向:</view>
        <view class="u-fx-f1">
          <u-radio-group v-model="currentStudent.userStatus" class="u-fx">
            <u-radio name="1" shape="circle">进</u-radio>
            <u-radio name="2" class="sign-left" shape="circle">出</u-radio>
          </u-radio-group>
        </view>
      </view>
      <u-button type="primary" @click="signOk">确定</u-button>
  </view>
</template>

<script>
import {store, actions} from '../store/index.js'
export default {
  name: 'SignCard',
  props: {
    currentStudent: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      signType: '1'
    }
  },
  methods: {
     signOk () {
      actions.addSign({
        inOrOut: this.currentStudent.userStatus, // 进行方向 1-进 2-出
        signType: this.signType, // 任务类型
        userCode: this.currentStudent.userCode, // 用户编码
        userName: this.currentStudent.userName,
        schoolCode: store.userInfo.schoolCode
      }).then(res => {
        this.$tools.toast('打卡成功')
        this.$tools.goNext(()=>{
          this.$emit('sign-ok')
        })        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .sign-card {
    padding-top: 20rpx;
    .sign-title {
      margin: 20rpx 0 50rpx 30rpx;
    }
    .sign-type {
      padding-bottom: 60rpx;
      .sign-text {
        width: 200rpx;
        text-align: center;
        .sign-left {
        margin-left: 40rpx;
      }
      }
    }
  }
</style>
