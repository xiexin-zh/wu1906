<template>
  <view class="detail">
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-bg-fff">
        <view class="detail-top u-fx-ver u-padd-t20 u-padd-b20 u-mar-l30 u-mar-r30">
          <view class="u-content-color">事故详情：</view>
          <view class="u-mar-t20 u-mar-b20"> {{ detailInfo.details }}</view>
          <view class="img-box">
            <image class="u-mar-r20" :src="url" v-for="(url, index) in detailInfo.pictures" :key="index"></image>
          </view>
        </view>
      </view>
      <view class="u-padd-l30 u-padd-r30 u-padd-t20 u-padd-b20 u-bg-fff">
        <view class="u-fx-jsb u-mar-b20" v-for="(list, index) in detail" :key="index">
          <view class="u-tips-color">{{ list.title }}</view>
          <view class="u-content-color">{{ list.content }} </view>
        </view>
      </view>
      <view class="line" v-if="detailInfo.instructReports && detailInfo.instructReports.length > 0"></view>
      <view class="u-padd u-bg-fff" v-if="detailInfo.instructReports && detailInfo.instructReports.length > 0">
        <view class="u-mar-b20" v-for="item in detailInfo.instructReports" :key="item.id">
          <view class="u-tips-color">{{ item.userName }} {{item.type === '1' ? '批示' : '续报'}} （{{ item.time | gmtToDate }}）:</view>
          <view class="u-mar-t10 u-main-color"> {{ item.content }} </view>
        </view>
      </view>
      <view class="line"></view>
      <view class="u-padd u-bg-fff" v-if="state === '已结案未批示' || state === '已结案已批示'">
        <view class="u-mar-b20">
          <view class="u-tips-color">结案报告:</view>
          <view class="u-mar-t10 u-main-color"> {{ detailInfo.finishInfo }} </view>
        </view>
      </view>
      <view class="u-fx-jsb u-padd u-bg-fff" v-if="state === '新填报未批示' ||state === '处理中未批示' || state === '处理中已批示'">
        <view class="u-fx-f1">
          <view>学校续报：</view>
          <textarea class="item-text-area u-padd-t20 u-font-02" v-model="content" placeholder="请填写续报内容" />
        </view>
        <u-button class="custom-style" :hair-line="false" :loading="loading" @click="submit(1)">续报</u-button>
      </view>
      <view class="line"></view>
      <view class="u-fx-jsb u-padd u-bg-fff" v-if="state === '新填报未批示' || state === '处理中未批示' || state === '处理中已批示'">
        <view class="u-fx-f1">
          <view>结案报告：</view>
          <textarea class="item-text-area u-padd-t20 u-font-02" v-model="finishInfo" placeholder="请填写结案内容" />
        </view>
        <u-button class="custom-style" :hair-line="false" :loading="conformLoading" @click="submit(2)">结案</u-button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import { actions, store } from './store/index'
export default {
  data() {
    return {
      loading: false,
      state: '',
      detailInfo: {},
      detail: {},
      content: '',
      finishInfo: '',
      conformLoading: false
    }
  },
  mounted() {
    this.detailId = this.$tools.getQuery().get('id')
    this.state = this.$tools.getQuery().get('state')
    this.accidentDetailGet()
  },
  methods: {
    async accidentDetailGet() {
      const res = await actions.getAccidentDetail(this.detailId)
      this.detailInfo = res.data
      this.detail = [
        {
          title: '事故填报学校：',
          content: res.data.schoolName
        },
        {
          title: '事故发生地点：',
          content: res.data.location
        },
        {
          title: '事故发生时间：',
          content: this.$tools.getDateTime(res.data.happenTime, 'date')
        },
        {
          title: '事故分类：',
          content: this.$tools.accidentType(res.data.type)
        },
        {
          title: '事故性质：',
          content: this.$tools.accidentNature(res.data.nature)
        },
        {
          title: '事故等级：',
          content: this.$tools.accidentLevel(res.data.level)
        },
        {
          title: '事故现状态：',
          content: res.data.nowStatus
        }
      ]
    },
    async submit(type) {
      if (type === 1 && !this.content) {
        this.$tools.toast('请填写续报内容')
        return
      }
      if (type === 2 && !this.finishInfo) {
        this.$tools.toast('请填写结案内容')
        return
      }
      if (type === 1) {
        const req = {
          accidentId: this.detailId,
          content: this.content,
          type: '2',
          userCode: store.userInfo.userCode,
          userName: store.userInfo.userName
        }
        this.$tools.confirm('确定进行续报吗？', () => {
          this.loading = true
          actions
            .reportAccident(req)
            .then((res) => {
              this.$tools.toast('续报成功')
              this.loading = false
              this.$tools.goNext(() => {
                eventBus.$emit('getList')
                this.$tools.navTo({
                  url: './index'
                })
              })
            })
            .catch(() => {
              this.loading = false
            })
        })
      } else {
        const req = {
          finishInfo: this.finishInfo,
          id: this.detailId,
          userCode: store.userInfo.userCode,
          userName: store.userInfo.userName
        }
        this.$tools.confirm('确定进行结案吗？', () => {
          this.conformLoading = true
          actions
            .finishAccident(req)
            .then((res) => {
              this.$tools.toast('结案成功')
              this.$tools.goNext(() => {
                this.conformLoading = false
                eventBus.$emit('getList')
                this.$tools.navTo({
                  url: './index'
                })
              })
            })
            .catch(() => {
              this.conformLoading = false
            })
        })
      }
    }
  }
}
</script>

<style lang="scss">
.custom-style {
  color: $u-type-primary;
  width: 150rpx;
  height: 50rpx;
  background-color: $u-type-primary-light;
  border: none;
}
.detail {
  .scroll-h {
    background-color: #f4f7fc;
    height: calc(100vh - 10rpx);
    .detail-top {
      border-bottom: 1px dashed #ccc;
    }
    .img-box {
      image {
        width: 152rpx;
        height: 152rpx;
      }
    }
  }
  .line {
    height: 20rpx;
    background-color: #f4f7fc;
  }
  .item-text-area {
    height: 120rpx;
    width: 100%;
    line-height: 40rpx;
    color: $u-content-color;
  }
}
</style>
