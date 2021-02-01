<template>
  <view class="student-attendance u-page">
      <view>
        <uni-calendar :showMonth="false" @change="change"></uni-calendar>
      </view>
      <view class="record-box">
        <view class="attandence-bgc"></view>
        <view class="attandence-title u-fx-ac-jc">上下学考勤统计</view>
          <scroll-view scroll-y="true" class="attandence-box">
          <view 
            class="attandence-info u-fx-ac-jc" 
            v-for="item in attandenceInfo" 
            :key="item.id"
            @click="detail(item)"
          >
            <image :src="`/mobile-img/${item.img}.png`" mode=""></image>
            <view> {{item.title}}</view>
            <view class="attandence-num"> {{item.num}}人</view>
          </view>
         </scroll-view>
      </view>
    <u-popup class="popup" ref="popup" mode="center" length="75%" :mask-close-able="false" border-radius="20">
     	<image src="/mobile-img/popovers_heard.png" mode="" class="img"></image>
      <scroll-view scroll-y="true" class="scroll" @scrolltolower="loadMore">
        <view v-for="list in dataList" :key="list.id" class="list u-bd-b u-fx-jsb u-fx-ac">
          <text> {{ list.userName }} </text>
          <image :src="list.photoUrl ? list.photoUrl : '/mobile-img/child-auto-icon.png'" mode=""></image>
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
	data() {
		return {
			dataList: [],
      attandenceInfo: [],
      day: new Date(),
      pageList: {
				page: 1,
				size: 15
      },
      morePage: false,
      num: 0
		}
	},
	mounted() {
    const date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    this.day = y + '-' + m + '-' + d
		this.showList();
	},
	methods: {
		async showList () {
      const req = {
        teacherCode: store.userInfo.userCode,
        day: this.day
			}
      const res = await actions.classDayStatic(req)
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
          state: '4',
          num: res.data.leaveCount,
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
          state: '4',
          num: 0,
          img: 'kq-qj-icon'
        }]
      }
			
    },
    change (data) {
      this.day = data.fulldate
      this.showList()
    },
		async detail(item, tag = false) {
      this.num = item.num
      if (item.num !== 0) {
        if (tag) {
          this.pageList.page += 1
        } else {
          this.pageList.page = 1
        }
        const req = {
          day: this.day,
          teacherCode: store.userInfo.userCode,
          state: item.state,
          page: this.pageList.page,
				  size: this.pageList.size
        }
        const res = await actions.classDayStaticDetail(req)
        if (tag) {
          this.dataList = this.dataList.concat(res.data)
        } else {
          this.dataList = res.data
        }
			  this.morePage = res.data.hasNextPage
        this.$refs.popup.open()
      }
    },
    loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕')
				return
			}
			this.detail(this.num, true)
    },
    close () {
      this.$refs.popup.close()
    }
	}
};
</script>

<style lang="scss" scoped>
.u-page{
  color: $u-main-color;
  background-color: #fff;
}
.student-attendance {
  .scroll-h{
    height: 100vh;
  }
  .record-box {
    .attandence-bgc{
      height: 20rpx;
      background-color: #F4F7FC;
    }
    .attandence-title {
      height: 60rpx;
      line-height: 60rpx;
      font-size: 32rpx;
      font-weight: bold;
      margin-top: 10rpx;
    }
    .attandence-box {
      height: calc(100vh - 880rpx);
      .attandence-info {
        width: 30%;
        float: left;  
        margin-bottom: 30rpx;
        background-color: $uni-bg-color;
        margin: 20rpx 0 5rpx 20rpx;
        padding: 20rpx 0;
        border-radius: 15rpx;
        border-right: 6rpx solid #F4F7FC;
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 10rpx;
        }
      }
      :nth-child(3n) {
        border-right: none;
      }
      .attandence-num {
        color: $u-light-color;
        font-size: 28rpx;
      }
    }
  }
  .popup {
    .img {
      width: 100%;
      height: 220rpx;
      margin-bottom: 10rpx;
    }
    .scroll {
      height: 50vh;
      .list {
        padding: 15rpx 25rpx;
          text-align: center;
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
