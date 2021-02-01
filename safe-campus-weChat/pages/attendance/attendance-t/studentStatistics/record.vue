<template>
  <view class="stundent-statistics u-page">
    <view>
      <view class="title u-fx-ac">
        <image :src="photo ? photo : '/mobile-img/child-auto-icon.png'" mode=""></image>
        <view>{{studentName}} {{month}} 考勤统计</view>
      </view>
      <view class="record-box">
        <view class="attandence-box">
          <view 
            class="attandence-info u-fx-ac-jc" 
            v-for="item in attandenceInfo" 
            :key="item.id"
            @click="detail(item)"
          >
            <image :src="`/mobile-img/${item.img}.png`" mode=""></image>
            <view> {{item.title}}</view>
            <view class="attandence-num"> {{item.num}}</view>
          </view>
        </view>
      </view>
      <view class="title u-fx-ac">
        <image :src="photo ? photo : '/mobile-img/child-auto-icon.png'" mode=""></image>
        <view>{{studentName}}  {{month}} 考勤记录</view>
      </view>
      <scroll-view scroll-y="true" class="scroll">
        <steps :studentCode="studentCode" :month="month"></steps>
      </scroll-view>
    </view>
    <u-popup class="popup" ref="popup" mode="center" length="75%" :mask-close-able="false" border-radius="20">
      <image src="/mobile-img/popovers_heard.png" mode="" class="img"></image>
      <scroll-view scroll-y="true" class="scroll-h">
        <view v-for="list in dataList" :key="list.id" class="list u-bd-b">
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
import steps from './steps.vue'
import { store, actions } from '../store/index.js'
export default {
  components: {
    steps
  },
  data () {
    return {
      dataList: [],
      attandenceInfo:[],
      pageList: {
				page: 1,
				size: 15
      },
      morePage: false,
      num: '',
      studentCode: '',
      studentName: '',
      month: '',
      photo: ''
    }
  },
  //  onLoad(options) {
  //   console.log('options',decodeURIComponent(options.photo))
  //   this.studentCode = options.userCode
  //   this.studentName = options.name
  //   this.month = options.month
  //   this.photo = decodeURIComponent(options.photo)
  // },
  mounted() {
    this.studentCode =  this.$tools.getQuery().get('userCode') 
    this.studentName = this.$tools.getQuery().get('name') 
    this.month = this.$tools.getQuery().get('month') 
    this.photo = decodeURIComponent(this.$tools.getQuery().get('photo') )
    this.showList()
  },
  methods: {
  	async showList () {
      const req = {
				month: this.month,
				studentCode: this.studentCode
			}
      const res = await actions.studentMonthStatic(req)
			if (res.data) {
        this.attandenceInfo = [{
          title: '正常',
          state: '5',
          num: `${res.data.normalCount}天`,
          img: 'kq-zc-icon'
        },{
          title: '上学缺卡',
          state: '3',
          num: `${res.data.onNoRecordCount}次`,
          img: 'kq-sbqk-icon'
        },{
          title: '迟到',
          state: '1',
          num:  `${res.data.lateCount}次`,
          img: 'kq-cd-icon'
        },{
          title: '早退',
          state: '2',
          num:  `${res.data.earlyCount}次`,
          img: 'kq-zt-icon'
        },{
          title: '放学缺卡',
          state: '6',
          num:  `${res.data.offNoRecordCount}次`,
          img: 'kq-xbqk-icon'
        },{
          title: '缺勤',
          state: '7',
          num:  `${res.data.noRecord}天`,
          img: 'kq-qq-icon'
        },{
          title: '请假',
          state: '4',
          num:  `${res.data.leaveCount}次`,
          img: 'kq-qj-icon'
        }]
      } else {
        this.attandenceInfo = [{
          title: '正常',
          state: '5',
          num: '0天',
          img: 'kq-zc-icon'
        },{
          title: '上学缺卡',
          state: '3',
          num: '0次',
          img: 'kq-sbqk-icon'
        },{
          title: '迟到',
          state: '1',
          num:  '0次',
          img: 'kq-cd-icon'
        },{
          title: '早退',
          state: '2',
          num:  '0次',
          img: 'kq-zt-icon'
        },{
          title: '放学缺卡',
          state: '6',
          num:  '0次',
          img: 'kq-xbqk-icon'
        },{
          title: '缺勤',
          state: '7',
          num:  '0天',
          img: 'kq-qq-icon'
        },{
          title: '请假',
          state: '4',
          num:  '0次',
          img: 'kq-qj-icon'
        }]
      }
    },
    close () {
      this.$refs.popup.close()
    },
    async detail (item) {
      this.num = item.num
      if (item.num !== '0次' && item.num !== '0天') {
        const req = {
          month: this.month,
          studentCode: this.studentCode,
          state: item.state
        }
        const res = await actions.childStaticDetail(req)
        this.dataList = res.data
        this.$refs.popup.open()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.stundent-statistics {
  background-color: $uni-bg-color-grey;
  color: $u-main-color;
  .title {
    height: 80rpx;
    background-color: $uni-bg-color;
    justify-content: center;
    image {
      width: 50rpx;
      height: 50rpx;
      margin-right: 10rpx;
      border-radius: 50%;
    }
  }
  .record-box {
    background-color:$uni-bg-color-hover;
    .attandence-box {
      height: 625rpx;
      .attandence-info {
        width: 29.8%;
        float: left;  
        background-color: $uni-bg-color;
        margin: 15rpx 0 5rpx 20rpx;
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
      :nth-child(3n) {
        border-right: none;
      }
    }
  }
  .scroll {
    height: calc(100vh - 820rpx);
    background-color: $uni-bg-color;
    margin-top: 15rpx;
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