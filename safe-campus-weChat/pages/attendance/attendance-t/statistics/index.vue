<template>
  <view class="statistics u-page">
    <view>
      <view class="year-list">
        <view class="title">{{yearTitle.split('-')[0]}}年</view>
        <view class="last-month u-fx u-fx-jsa" >
					<view @click="searchMonth(month)" :class="{'act': yearTitle === month}" v-for="month in lastMonth" :key="month">
						{{ month.split('-')[1] }}月
					</view>
				</view>
      </view>
        <view class="attandence-title u-fx-ac-jc">上下班考勤统计</view>
        <scroll-view scroll-y="true" class="attandence-box">
          <view class="attandence-info u-fx-jsb"  v-for="item in attandenceInfo" 
            :key="item.id"
            @click="detail(item)">
            <image :src="`/mobile-img/${item.img}.png`" mode=""></image>
            <view class="attandence-word u-fx-f1"> 
              <view> {{item.title}}</view>
              <view class="attandence-num"> {{item.num}}次</view>
            </view>
          </view>
        </scroll-view>
    </view>
    <u-popup class="popup" ref="popup" mode="center" length="75%" :mask-close-able="false" border-radius="20">
      <image src="/mobile-img/popovers_heard.png" mode="" class="img"></image>
      <scroll-view scroll-y="true" class="scroll-h">
        <view v-for="list in dataList" :key="list" class="list u-bd-b">
          <text>{{ list | gmtToDate('date') }}</text>
        </view>
      </scroll-view>
      <view class="submit-btn u-fx-ac">
        <u-button class="btn u-font-01" type="primary"  size="mini" @click="close" >知道了</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { store, actions } from '../store/index.js'
export default {
  data () {
    return {
      dataList: [],
      attandenceInfo:[],
			lastMonth: this.lastFiveMonth(),
      yearTitle: this.lastFiveMonth().pop(),
      num: ''
    }
  },
  mounted () {
    this.searchMonth(this.yearTitle)
  },
  methods: {
		lastFiveMonth (num = 6) {
			var monthArr = []
			var date = new Date()
			var year = date.getFullYear()
			var month = date.getMonth() + 2
			if (month > num) {
				for (var i = month - 1; i >= month - num; i--) {
					monthArr.push(year + '-' + (i > 9 ? i : '0' + i))
				}
			} else {
				var lastY = year - 1
				var cMonth = month - 1
				var lastM = num - (month - 1)
				for (let i = cMonth; i > 0; i--) {
					monthArr.push(year + '-' + (i > 9 ? i : '0' + i))
				}
				for (let i = 12; i > 12 - lastM; i--) {
					monthArr.push(lastY + '-' + (i > 9 ? i : '0' + i))
				}
			}
			return monthArr.reverse()
		},
		async searchMonth (month) {
      this.yearTitle = month
      const req = {
        month: month,
				userCode: store.userInfo.userCode
			}
      const res = await actions.getTeacherStatic(req)
      if( res.data ) {
        this.attandenceInfo = [{
          title: '正常',
          state: '5',
          num: res.data.normalCount,
          img: 'kq-zc-icon'
        },{
          title: '上班缺卡',
          state: '3',
          num: res.data.onNoRecordCount,
          img: 'kq-sbqk-icon'
        },{
          title: '迟到',
          state: '1',
          num:  res.data.lateCount,
          img: 'kq-cd-icon'
        },{
          title: '早退',
          state: '2',
          num:  res.data.earlyCount,
          img: 'kq-zt-icon'
        },{
          title: '下班缺卡',
          state: '6',
          num:  res.data.offNoRecordCount,
          img: 'kq-xbqk-icon'
        },{
          title: '缺勤',
          state: '7',
          num:  res.data.noRecord,
          img: 'kq-qq-icon'
        },{
          title: '请假',
          state: '4',
          num:  res.data.leaveCount,
          img: 'kq-qj-icon'
        }]
      } else {
        this.attandenceInfo = [{
          title: '正常',
          state: '5',
          num: 0,
          img: 'kq-zc-icon'
        },{
          title: '上班缺卡',
          state: '3',
          num: 0,
          img: 'kq-qk-icon'
        },{
          title: '迟到',
          state: '1',
          num:  0,
          img: 'kq-cd-icon'
        },{
          title: '早退',
          state: '2',
          num:  0,
          img: 'kq-zt-icon'
        },{
          title: '下班缺卡',
          state: '6',
          num:  0,
          img: 'kq-qk-icon'
        },{
          title: '缺勤',
          state: '7',
          num:  0,
          img: 'kq-qq-icon'
        },{
          title: '请假',
          state: '4',
          num: 0,
          img: 'kq-qj-icon'
        }]
      }
		},
    async detail (item) {
      if ( item.num !== 0 ) {
        this.$tools.navTo({
          url: `./detail?month=${this.yearTitle}&state=${item.state}`,
          title: `${item.title}详情`
        })
      }
    },
    close () {
      this.$refs.popup.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.u-page {
  background-color: #fff;
  color: $u-main-color;
}
.statistics {
	.year-list {
    background-color: $u-type-primary;
    .title {
      color:$uni-bg-color;
      font-size: 34rpx;
      font-weight: bold;
      text-align: center;
      padding: 30rpx 0 0rpx 0;
    }
    .last-month {
      padding: 20rpx 0 40rpx 0;
      & > view {
        color:$uni-bg-color;
        text-align: center;
        height: 80rpx;
        width: 80rpx;
        line-height: 80rpx;
        border-radius: 100%;
      }
      .act {
        background-color: $uni-bg-color;
        color: $u-type-primary;
        font-weight: bold
      }
    }
  }
  .attandence-title {
    height: 60rpx;
    line-height: 60rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 20rpx;
  }
  .attandence-box {
    height: calc(100vh - 300rpx);
    :nth-child(3n) {
      border-right: none;
    }
    .attandence-info {
      width: 43.5%;
      float: left;  
      margin-bottom: 30rpx;
      background-color: $uni-bg-color;
      margin: 25rpx 25rpx 5rpx 25rpx;
      padding: 50rpx 40rpx;
      border-radius: 15rpx;
      box-shadow: 0px 1px 6px #ddedef;
      image {
        width: 80rpx;
        height: 80rpx;
      }
      .attandence-word {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: inherit;
        .attandence-num {
          margin-top: 4rpx;
          color: $u-content-color;
          font-size: 28rpx;
        }
      }
    }
  }
  .popup {
    .img {
      width: 100%;
      height: 220rpx;
      margin-bottom: 10rpx;
    }
    .scroll-h {
       height: 50vh;
      .list {
        padding: 15rpx 25rpx;
        text-align: center;
        &:first-of-type {
          padding-top: 0rpx;
        }
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }
    .submit-btn {
      height: 80rpx;
      justify-content: center;
      .btn {
        letter-spacing: 8rpx;
        margin: 0 20rpx;
        width: 90%;
      }
    }
  }
}
</style>