<template>
  <view class="attendance u-page">
    <view>
      <view class="calendar">
        <uni-calendar :showMonth="false" @change="change" @monthSwitch="monthSwitch" :selected = "selected"></uni-calendar>
      </view>
      <view class="record-box">
        <view class="work-box u-fx-jsb">
          <view>
            <view v-if="dayInfo && dayInfo.onTime"> 上学打卡 {{ dayInfo.onTime  | gmtToDate('time') }} </view>
            <view v-else> 上学打卡 --:-- </view>
            <view v-if="dayInfo && dayInfo.onState" 
              :class ="[
                { 'unnormal-title': dayInfo.onState === 1 || dayInfo.onState === 2 },
                { 'normal-title': dayInfo.onState === 5 },
                { 'absence-title': dayInfo.onState === 3 || dayInfo.onState === 7 || dayInfo.onState === 4 }, 
                'work-title']"> {{dayInfo.onState | getState}}</view>
          </view>
          <view>
            <image :src="(dayInfo && dayInfo.onSnacpUrl) ? dayInfo.onSnacpUrl : '/mobile-img/child-auto-icon.png'"></image>
          </view>
        </view>
        <view class="work-box u-fx-jsb">
          <view>
            <view v-if="dayInfo && dayInfo.offTime"> 放学打卡 {{ dayInfo.offTime | gmtToDate('time') }} </view>
            <view v-else> 放学打卡 --:-- </view>
            <view v-if="dayInfo && dayInfo.offState" 
              :class ="[
                { 'unnormal-title': dayInfo.offState === 1 || dayInfo.offState === 2 },
                { 'normal-title': dayInfo.offState === 5 },
                { 'absence-title': dayInfo.offState === 6 || dayInfo.offState === 7 || dayInfo.offState === 4 }, 
                'work-title']"> {{dayInfo.offState | getState}}</view>
          </view>
          <view>
            <image :src="(dayInfo && dayInfo.offSnacpUrl) ? dayInfo.offSnacpUrl : '/mobile-img/child-auto-icon.png'"></image>
          </view>
        </view>
      </view>
    </view>
    <choose-child @change="childInfo"></choose-child>
  </view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue'
import { store, actions } from '../store/index.js'
export default {
  data () {
    return {
      dayInfo: {},
      day: new Date(),
      studentCode: '',
      mounth: new Date(),
      selected: []
    }
  },
  components: {
    chooseChild
  },
  mounted () {
    const date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    this.day = y + '-' + m + '-' + d
    this.mounth = y + '-' + m
    this.studentCode = store.childList[0].userCode
    this.showState()
    this.showList()
  },
  methods: {
    // 正常 迟到(早退) 缺卡 绿色 橙色 红色
    async showState () {
      const req ={
        studentCode: this.studentCode,
        month: this.mounth
      }
      const res = await actions.studentMonthState(req)
      res.data.forEach(ele => {
        if(!ele.staue){
          this.selected.push({	
            date: this.$tools.getDateTime(ele.date),
            staue: false
          })
        }
			})
    },
    monthSwitch (item) {
      this.mounth=`${item.year}-${ item.month < 10 ? ('0' + item.month) : item.month }`
      this.day = ''
      this.showState()
      this.showList()
    },
    async showList (tag = false) {
      const req ={
        studentCode: this.studentCode,
        day: this.day
      }
      const res = await actions.getChildAttendance(req)
      this.dayInfo = res.data
    },
    change (data) {
      this.day = data.fulldate
      this.showList()
    },
    childInfo (item) {
      if (item.userCode !== this.studentCode) {
        this.studentCode = item.userCode
        this.showList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.attendance {
  .record-box {
    margin-top: 20rpx;
    background-color: $uni-bg-color;
    .work-box {
      padding: 30rpx 40rpx;
      border-bottom: 1rpx solid ￥u-border-color-dark;
      image {
        height: 80rpx;
        width: 80rpx;
      }
      .work-title {
        margin-top: 20rpx;
      }
      .normal-title {
        color: $u-type-success;
      }
      .absence-title {
        color: $u-tips-color;
      }
      .unnormal-title {
        color: $u-type-warning;
      }
    }
  }
}
</style>
