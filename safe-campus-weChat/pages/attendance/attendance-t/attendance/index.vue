<template>
  <view class="attendance u-page">
    <view>
      <view class="calendar-bg">
        <view class="calendar u-border-radius u-padd-l40 u-padd-r40 u-padd-t20 u-padd-b10 u-type-white-bg">
          <uni-calendar :showMonth="false" @change="change" @monthSwitch="monthSwitch" :selected="selected"></uni-calendar>
        </view>
      </view>
      <view class="record-box u-padd-l40 u-padd-r40 u-padd-t20 u-padd-b10 u-type-white-bg u-border-radius">
        <view class="title u-fx-ac"> 
          <image src="/mobile-img/kq-shijian.png"></image>
          <view class="u-mar-l10">打卡记录</view> 
        </view>
          <steps ref="steps"></steps>
      </view>
    </view>
  </view>
</template>

<script>
import { store, actions } from '../store/index.js'
import steps from './steps.vue'
export default {
  components: {
    steps
  },
  data () {
    return {
      day: new Date(),
      mounth: new Date(),
      selected: [],
      studentCode: '',
      studentName: '',
      month: ''
    }
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
    this.showState()
    this.showList()
  },
  methods: {
    // 正常 迟到(早退) 缺卡 绿色 橙色 红色
    async showState () {
      this.selected = []
      const req = {
        userCode: store.userInfo.userCode,
        month: this.mounth
      }
      const res = await actions.teacherStaticState(req)
      res.data.forEach(ele => {
        this.selected.push({	
          date: this.$tools.getDateTime(ele.date),
          staue: ele.staue
        })
      })
    },
    monthSwitch (item) {
      this.mounth=`${item.year}-${ item.month < 10 ? ('0' + item.month) : item.month }`
      this.day = ''
      this.showState()
      this.showList()
    },
    async showList () {
      const req ={
        userCode: store.userInfo.userCode,
        day: this.day
      }
      const res = await actions.getTeacherAttendance(req)
      this.$refs.steps.dayInfo = [
          {
            id:'1',
            title: '上午班',
            item:[
              {
                id:'1',
                title: '上班',
                morningOnRealTime: res.data ? res.data.morningOnRealTime : '',
                morningOnSnacpUrl: res.data ? res.data.morningOnSnacpUrl : '',
                morningOnState: res.data ? res.data.morningOnState : ''
              },
              {
                id:'2',
                title: '下班',
                morningOffRealTime: res.data ? res.data.morningOffRealTime : '',
                morningOffSnacpUrl: res.data ? res.data.morningOffSnacpUrl : '',
                morningOffState: res.data ? res.data.morningOffState : ''
              }
            ]
        } ,
        {
          id:'2',
          title: '下午班',
          item:[
              {
                id:'1',
                title: '上班',
                noonOnRealTime: res.data ? res.data.noonOnRealTime : '',
                noonOnSnacpUrl: res.data ? res.data.noonOnSnacpUrl : '',
                noonOnState: res.data ? res.data.noonOnState : ''
              },
              {
                id:'2',
                title: '下班',
                noonOffState: res.data ? res.data.noonOffState : '',
                noonOffSnacpUrl: res.data ? res.data.noonOffSnacpUrl : '',
                noonOffRealTime: res.data ? res.data.noonOffRealTime : ''
              }
          ]
        }
      ]
    },
    change (data) {
      if(data.fulldate === this.$tools.getDateTime(new Date(),'date')){
        this.mounth = data.fulldate.substring(0, 7)
        this.showState()
      }
      this.day = data.fulldate
      this.showList()
    }
  }
}
</script>

<style lang="scss" scoped>
.attendance {
  height: calc(100vh - 10rpx);
  overflow-y: scroll;
  .record-box {
    margin-top: 570rpx;
    width: 92%;
    margin-left: 4%;
  }
}
.calendar-bg {
  height: 268rpx;
  background: url('/mobile-img/date-bg.png') no-repeat center; 
  background-size: 100% 100%;
  position: relative;
  .calendar{
    left: 4%;
    width: 92%;
    height: 750rpx;
    position: absolute;
    margin-top: 60rpx;
  }
}
.title {
  image {
    width: 32rpx;
    height: 28rpx;
  }
}
/deep/ .uni-calendar-item__weeks-box-item {
  width: 88rpx;
  height: 88rpx;
}
/deep/ .uni-calendar__header {
  background-color: #fff;
  color: #000;
}
/deep/ .uni-calendar__weeks-day{
  border: none;
}
/deep/ .uni-calendar-item--checked{
  border-radius: 50%;
}
/deep/ .uni-calendar-item--isDay{
  border-radius: 50%;
}
/deep/ .uni-calendar__header{
  border: none;
}
/deep/ .uni-calendar-item__weeks-box-circle{
  top: 70rpx;
  right: 36rpx;
}
</style>
