<template>
  <view class="record u-page u-fx-ver">
    <view class="time-box u-padd-l20 u-padd-r20 u-fx-ver">
      <u-picker v-model="show" mode="time" @confirm="confirm"></u-picker>
      <view class="record-date u-fx-ac-jc" @click="show = true">
        <view class="u-font-2">
          {{startDate }}
          <image class="u-mar-l20" src="/mobile-img/safe-xl.png" mode=""></image>
        </view>
      </view>
      <view class="record-sub">
        <u-subsection 
          mode="subsection"
          :safe="true"
          :list="dataList" 
          active-color="#fff"
          :current="currentState"
          @change="tabChange">
        </u-subsection>
      </view>
    </view>
    <view class="record-content u-fx-f1 u-fx-ver u-shadow">
      <u-tabs
        :list="list" 
        :is-scroll="false"
        :current="current"
        @change="change"
        ></u-tabs>
      <scroll-view  scroll-y="true" class="scroll-h" >
        <no-data msg="暂无数据~" v-if="staticList.length === 0"></no-data>
        <view class="leave-box u-fx-jsb" v-for="item in staticList" :key="item.code" @click="detail(item.code,item.name)">
          <view>{{ item.name }}</view>
          <view>
            {{ item.num }}
            <image class="u-mar-l10" src="/mobile-img/safe-right.png" mode=""></image>
          </view>
        </view>
      </scroll-view> 
    </view>
  </view>
</template>

<script>
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
      staticList: [],
      list: [{
					name: '按区域统计'
				}, {
					name: '按人员统计'
				}],
      currentState: 0,
      current: 0,
      dataList: [
        {
          name: '待巡查'
        }, 
        {
          name: '已巡查'
        }, 
        {
          name: '未巡查'
        }
      ],
      show: false,
      startDate: this.$tools.getDateTime(new Date(), 'date')
    }
  },
  mounted () {
    this.currentTmie= this.$tools.getDateTime(new Date(), 'second')
    this.date= this.$tools.getQuery().get("date")
    this.startDate = this.date.replace(/-/g, '/').substring(0, 11)
    this.staticGet()
  },
  methods: {
    change(index) {
      console.log(1,index)
      this.current = index
      this.staticGet()
    },
    tabChange (index) {
      this.currentState = index
      this.staticGet()
    },
    confirm (e) {
      this.startDate = `${e.year}/${e.month}/${e.day}`
      this.date = this.startDate ? `${this.startDate.replace( /\//g, '-')} ${this.currentTmie}` : `${this.startDate.replace( /\//g, '-')} 23:59:59`
      this.staticGet()
    },
    async staticGet () {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        date: this.date,
        state: this.currentState
      }
      if (this.current === 0) {
        const res = await actions.getStaticArea(req)
        this.staticList = res.data
      } else {
        const res = await actions.getStaticUser(req)
        this.staticList = res.data
      }
    },
    detail (code, name) {
      this.$tools.navTo({
				url: `./list?code=${code}&date=${this.date}&type=${this.current}`,
				title: `${name}(${this.date.replace(/-/g, '/').substring(0,10)})`
			})
    }
  }
}
</script>

<style lang="scss" scoped>
.u-page {
  background-color: #F4F7FC;
  color: $u-main-color;
}
.record {
  .time-box {
    height: 310rpx;
    background: url('/mobile-img/safe-record.png') no-repeat; 
    background-size: cover;
    .record-date {
      height: 136rpx;
      color: #fff;
      image {
        width: 20rpx;
        height: 15rpx;
        vertical-align: middle;
      }
    }
  }
  .record-content {
    margin: -60rpx  20rpx 20rpx 20rpx;
    padding: 36rpx 48rpx;
    background-color: #fff;
    border-radius: $u-border-radius;
    .scroll-h {
      height: calc(100vh - 400rpx);
        .leave-box {
          border-bottom: 1px solid $u-border-color;
          height: 86rpx;
          line-height: 86rpx;
        image {
          width: 12rpx;
          height: 20rpx;
        }
      }
    }
  }
}
</style>
