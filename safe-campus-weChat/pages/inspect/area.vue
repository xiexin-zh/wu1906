<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-type-white-bg u-font-01 u-padd-20">
        <view class="u-fx-ac">
          <view>巡查点状态：</view>
          <view class="u-fx-f1 u-fx-je ">
            <view >异常</view>
            <u-switch size='40' class="u-mar-l10 u-mar-r10" v-model="hasDispose"></u-switch>
            <view >正常</view>
          </view>
        </view>
        <u-tag v-if="!hasDispose" class="u-mar-t" type="primary" mode="plain" text="上报隐患" shape="circle" @click="add" />
        <view class="u-type-primary" v-if="dangerList.length > 0">
          <view class="u-fx-jsb u-mar-t" v-for="(list,index) in dangerList" :key="index">
            <view> 隐患编号：{{ list }}</view>
            <view> 上报人：{{ userName }}</view>
          </view>
      </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submitForm"
        >提交</u-button
      >
    </view>
  </view>
</template>

<script>
import validateForm from '@u/validate'
import { store, actions } from './store/index.js'
export default {
  data() {
    return {
      hasDispose: true,
      dangerList: [],
      userName: ''
    }
  },
  created() {
    this.userName = store.userInfo.userName
    this.dangerList = store.dangerList
  },
  mounted () {
    this.inspectId = this.$tools.getQuery().get('inspectId')
    this.code = this.$tools.getQuery().get('code')
    this.patrolPointName = this.$tools.getQuery().get('name')
  },
  methods: {
    add(type) {
      this.$tools.navTo({
        url: './add'
      })
    },
    submitForm() {
      let req = {
        id: this.inspectId,
        patrolPointCode: this.code,
        patrolPointName: this.patrolPointName,
        patrolResult: this.hasDispose
      }
      actions.submitInspect(req).then((res) => {
        this.$tools.goNext(() => {
          this.$tools.navTo({
            url: `./map?inspectId=${this.inspectId}`
          })
          uni.setStorageSync('dangerList', [])
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 120rpx);
}
</style>
