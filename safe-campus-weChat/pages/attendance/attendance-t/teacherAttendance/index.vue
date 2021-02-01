<template>
  <view class="attendance u-page">
    <view>
      <view class="calendar-bg">
        <view class="calendar u-border-radius u-padd-l40 u-padd-r40 u-padd-t20 u-padd-b10 u-type-white-bg">
          <!-- <uni-calendar :showMonth="false" @change="change" @monthSwitch="monthSwitch" :selected="selected"></uni-calendar> -->
          <uni-calendar :showMonth="false" @change="change" @monthSwitch="monthSwitch"></uni-calendar>
        </view>
      </view>
      <view class="record-box u-padd-l40 u-padd-r40 u-padd-t40 u-padd-b10 u-type-white-bg u-border-radius">
        <view v-for="list in tagList" :key="list.key">
          <view class="title u-tx-r u-fx-ac">
            <image :src="list.icon" class="u-mar-r20"></image>
            <u-tag v-if="list.key==='1'" type="success" :text="list.title" mode="dark" shape="circle"/>
            <u-tag v-else type="warning" :text="list.title" mode="dark" shape="circle"/>
          </view>
          <view class="time-box u-fx-ac u-mar-b20 u-padd-t40" v-for="(el,index) in classList" :key="index"> 
            <text class="title u-tx-r u-padd-r20">{{el.title}}</text>
            <view class="u-fx-f1 u-fx-jsb u-padd-l20"> 
              <view class="u-fx-f1" v-for="(item,i) in stateList" :key="i"> 
                <view class="u-fx-ver u-fx-ac">
                  <view >{{ (el.title === '下班' && item.key === '2') ? '早退' : item.title}}</view>
                  <view 
                    :class="['u-mar-t10', i === 0 ? 'u-type-primary' : i === 1 ? 'u-type-warning-dark' : 'absence']"
                    @click="detail(list.key, index, item.key)"
                  >
                    <text class="u-font-2 u-bold">
                      {{ (list.key === '1' && index === 0) ? teacherTotal[i] :
                       (list.key === '1' && index === 1) ? teacherTotal[i + 3] : 
                       (list.key === '2' && index === 0) ? teacherTotal[i + 6] : 
                       (list.key === '2' && index === 1) ? teacherTotal[i + 9] : ''}}
                    </text>
                    <text>人</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { store, actions } from '../store/index.js'
export default {
  data () {
    return {
      day: new Date(),
      mounth: new Date(),
      selected: [],
      tagList: [
        {
          key: '1',
          icon: '/mobile-img/attendance-am.png',
          title: '上午'
        },
        {
          key: '2',
          icon: '/mobile-img/attendance-pm.png',
          title: '下午'
        }
      ],
      classList: [
        {
          title: '上班'
        },
        {
          title: '下班'
        }
      ],
      stateList: [
        {
          key: '1',
          title: '正常'
        },
        {
          key: '2',
          title: '迟到'
        },
        {
          key: '3',
          title: '缺卡'
        }
      ],
      teacherTotal: []
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
    // this.showState()
    this.showList()
  },
  methods: {
    // 正常 迟到(早退) 缺卡 绿色 橙色 红色
    async showState () {
      this.selected = []
      const req = {
        schoolCode: store.userInfo.schoolCode,
        month: this.mounth
      }
      const res = await actions.teacherMonthState(req)
      res.data.forEach(ele => {
        if (!ele.staue) {
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
      // this.showState()
      this.showList()
    },
    async showList () {
      this.teacherTotal = []
      const req ={
        schoolCode: store.userInfo.schoolCode,
        date: this.day
      }
      const res = await actions.getTeaRecordStatic(req)
      this.teacherTotal.push(res.data[0].morningOnNormalCount || 0)
      this.teacherTotal.push(res.data[0].morningOnLateCount || 0)
      this.teacherTotal.push(res.data[0].morningOnNoRecordCount || 0)
      this.teacherTotal.push(res.data[0].morningOffNormalCount || 0)
      this.teacherTotal.push(res.data[0].morningOffEarlyCount || 0)
      this.teacherTotal.push(res.data[0].morningOffNoRecordCount || 0)
      this.teacherTotal.push(res.data[0].noonOnNormalCount || 0)
      this.teacherTotal.push(res.data[0].noonOnLateCount || 0)
      this.teacherTotal.push(res.data[0].noonOnNoRecordCount || 0)
      this.teacherTotal.push(res.data[0].noonOffNormalCount || 0)
      this.teacherTotal.push(res.data[0].noonOffEarlyCount || 0)
      this.teacherTotal.push(res.data[0].noonOffNoRecordCount || 0)
    },
    change (data) {
      this.day = data.fulldate
      this.showList()
    },
    detail (key,index,item) {
      let title = ''
      const req = {
        date: this.day
      }
      if(key === '1' && index === 0){
        title = '上午上班'
        req.morningOnState = item === '1' ? '5' : item === '2' ? '1' : item === '3' ? '3' : undefined
      } else if(key === '1' && index === 1){
         title = '上午下班'
        req.morningOffState = item === '1' ? '5': item === '2' ? '2' : item === '3' ? '6' : undefined
      } else if(key === '2' && index === 0){
         title = '下午上班'
        req.noonOnState = item === '1' ? '5': item === '2' ? '1' : item === '3' ? '3' : undefined
      } else if(key === '2' && index === 1){
         title = '下午下班'
        req.noonOffState = item === '1' ? '5' :item === '2' ? '2' : item === '3' ? '6' : undefined
      }
      this.$tools.navTo({
        url: `./detail?req=${JSON.stringify(req)}`,
        title: title
      })
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
.title {
  width: 160rpx;
  image {
    width: 44rpx;
    height: 44rpx;
  }
}
.absence {
  color: #F5B111;
}
.late {
  color:#F5772D;
}
.time-box {
  &:nth-of-type(3){
    position: relative;
    border-top: 1px #F2F2F2 solid;
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
/deep/ .uni-calendar-item__weeks-box-item {
  width: 88rpx;
  height: 88rpx;
}
/deep/ .uni-calendar__header {
  background-color: #fff;
  color: #000;
  border: none;
}
/deep/ .uni-calendar__weeks-day{
  border: none;
}
/deep/ .uni-calendar-item--checked,
/deep/ .uni-calendar-item--isDay {
  border-radius: 50%;
}
/deep/ .uni-calendar-item__weeks-box-circle{
  top: 70rpx;
  right: 36rpx;
}
</style>
