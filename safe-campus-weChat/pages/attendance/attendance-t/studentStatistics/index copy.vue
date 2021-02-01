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
      <view class="record-box">
        <view class="attandence-title u-fx-ac-jc">上下学考勤统计</view>
        <view class="attandence-box">
          <view 
            :class="['attandence-info', 'u-fx-ac-jc', {'active': currentIndex === index} ]" 
            v-for="(item, index) in attandenceInfo" 
            :key="item.id"
            @click="detail(item, index)"
          >
            <image :src="`/mobile-img/${item.img}.png`" mode=""></image>
            <view> {{item.title}}</view>
            <view class="attandence-num"> {{item.num}}次</view>
          </view>
        </view>
      </view>
      <view class="u-fx-ac-jc">
        <scroll-view  scroll-y="true" class="scroll-h">
          <no-data msg="暂无数据~" v-if="!dataList || dataList.length === 0"></no-data>
          <view v-else  v-for="(list, index) in dataList" :key="index" class="list u-fx-ac-jc u-fx-ac" @click="check(list)">
            <image :src=" list.photoUrl ? list.photoUrl : '/mobile-img/child-auto-icon.png'" mode=""></image>
            <text>{{ list.userName }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- <uni-popup ref="popup" type="center">
      <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
        <view v-for="list in dataList" :key="list" class="list u-bd-b">
          <text>{{ list | gmtToDate('date') }}</text>
        </view>
      </scroll-view>
    </uni-popup> -->
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
      currentIndex: 0
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
				teacherCode: store.userInfo.userCode
			}
      const res = await actions.classStatic(req)
      if ( res.data ) {
        this.attandenceInfo = [{
          title: '正常',
          state: '5',
          num: res.data.normalCount,
          img: 'kq-zc-icon'
        },{
          title: '上学缺卡',
          state: '3',
          num: res.data.onNoRecordCount,
          img: 'kq-sbqk-icon'
        },{
          title: '迟到',
          state: '1',
          num: res.data.lateCount,
          img: 'kq-cd-icon'
        },{
          title: '早退',
          state: '2',
          num: res.data.earlyCount,
          img: 'kq-zt-icon'
        },{
          title: '放学缺卡',
          state: '6',
          num: res.data.offNoRecordCount,
          img: 'kq-xbqk-icon'
        },{
          title: '缺勤',
          state: '7',
          num: res.data.noRecord,
          img: 'kq-qq-icon'
        },{
          title: '请假',
          state: '8',
          num: res.data.noRecord,
          img: 'kq-qj-icon'
        }]
      } else {
        this.attandenceInfo = [{
          title: '正常',
          state: '5',
          num: 0,
          img: 'kq-zc-icon'
        },{
          title: '上学缺卡',
          state: '3',
          num: 0,
          img: 'kq-sbqk-icon'
        },{
          title: '迟到',
          state: '1',
          num: 0,
          img: 'kq-cd-icon'
        },{
          title: '早退',
          state: '2',
          num: 0,
          img: 'kq-zt-icon'
        },{
          title: '放学缺卡',
          state: '6',
          num: 0,
          img: 'kq-xbqk-icon'
        },{
          title: '缺勤',
          state: '7',
          num: 0,
          img: 'kq-qq-icon'
        },{
          title: '请假',
          state: '8',
          num: 0,
          img: 'kq-qj-icon'
        }]
      }
      this.currentIndex = 0
      this.detail(this.attandenceInfo[0], this.currentIndex)
		},
    async detail(item, index){
      this.currentIndex = index
        const req = {
          month: this.yearTitle,
          teacherCode: store.userInfo.userCode,
          state: item.state
        }
        const res = await actions.classStaticDetail(req)
        this.dataList = res.data
    },
    check (record) {
      this.$tools.navTo({
				url: `./record?userCode=${record.userCode}&month=${this.yearTitle}&name=${record.userName}&photo=${encodeURIComponent(record.photoUrl)}`,
				title: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  color: $u-main-color;
	.year-list {
	    background-color: $uni-color-primary;
	    .title {
	      color: $uni-bg-color;
	      font-size: 34rpx;
	      font-weight: bold;
	      text-align: center;
	      padding: 30rpx 0 0rpx 0;
	    }
	    .last-month {
	      padding: 20rpx 0;
	      & > view {
	        color: $uni-bg-color;
	        text-align: center;
	        height: 80rpx;
	        width: 80rpx;
	        line-height: 80rpx;
	        border-radius: 100%;
	      }
	      .act {
	        background-color: $uni-bg-color;
	        color: $uni-color-primary;
	        font-weight: bold
	      }
	    }
	  }
  .record-box {
    padding-top: 10rpx;
    background-color: $u-border-color;
    .attandence-title {
      height: 45rpx;
      line-height: 45rpx;
      font-size: 32rpx;
      font-weight: bold;
    }
    .attandence-box {
      height: 625rpx;
      :nth-child(3n) {
        border-right: none;
      }
      .attandence-info {
        width: 31%;
        float: left;  
        margin-bottom: 30rpx;
        background-color: $uni-bg-color;
        margin: 15rpx 0 5rpx 15rpx;
        padding: 20rpx 0;
        border-radius: 15rpx;
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 10rpx;
        }
         .attandence-num {
          color: $u-content-color;
          font-size: 28rpx;
        }
      }
      .active {
        background-color: ￥u-border-color-dark;
      }
    }
  };
  .scroll-h {
    height: calc(100vh - 900rpx);
    background-color: $uni-bg-color;
    .list {
      width: 20%;
      float: left;
      padding: 15rpx 25rpx;
      font-size: 26rpx;
      image {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
      }
    }
  }
}

</style>