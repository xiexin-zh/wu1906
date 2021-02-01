<template>
  <view>
		<scroll-view  scroll-y="true" class="scroll-h">
		 <view class="item-info u-fx-ac-jc">
        <u-picker v-model="show" mode="time" @confirm="confirm" :params="params"></u-picker>
        <view class="item-status">
          <image :src="img" mode=""></image>
        </view>
        <view class="info-name u-mar-t30 u-font-1"> {{userName}} </view>
        <view class="info-title u-font-02"> 职务  </view>
        <view class="info-date u-padd-l10 u-padd-r10 u-fx u-font-01" @click="show = true">
          <image class="u-mar-l20 u-mar-r20" src="/mobile-img/safe-date.png" mode=""></image>
          <view> {{month}} </view>
        </view>
      </view>
      <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
        <view class="u-font-1"> 月度汇总</view>
      </view>
      <view class="collapse-box">
        <u-collapse :item-style="itemStyle">
          <u-collapse-item :title="`待完成(${beCompleteNum})`" key="0"  v-if="flag">
            <view 
              class="add-item u-padd-20 u-fx-jsb u-bd-b" 
              v-for="list in beCompleteList"
              :key="list.id" 
              @click="detail(list)">
              <view>{{list.wdate | gmtToDate('date')}}</view>
              <view>{{list.num}}</view>
            </view>
          </u-collapse-item>
           <u-collapse-item :title="`已完成(${completeNum})`" key="1" v-if="flag">
            <view 
              class="add-item u-padd-20 u-fx-jsb u-bd-b" 
              v-for="list in completeList" 
              :key="list.id"
              @click="detail(list)">
              <view>{{list.wdate | gmtToDate('date')}}</view>
              <view>{{list.num}}</view>
            </view>
          </u-collapse-item>
           <u-collapse-item :title="`未完成(${unCompleteNum})`" key="2" v-if="flag">
            <view 
              class="add-item u-padd-20 u-fx-jsb u-bd-b" 
              v-for="list in unCompleteList" 
              :key="list.id" 
              @click="detail(list)">
              <view>{{list.wdate | gmtToDate('date')}}</view>
              <view>{{list.num}}</view>
            </view>
          </u-collapse-item>
        </u-collapse>
			</view>
		</scroll-view>
  </view>
</template>

<script>
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
      itemStyle:{
        background:'#fff',
        paddingLeft:'20rpx',
        paddingRight:'20rpx',
        marginTop:'20rpx'
      },
      show: false,
      month: '',
      params: {
        year: true,
        month: true,
        day: false,
        hour: false,
        minute: false,
        second: false
      },
      stateList: [{
        name: '待完成',
      },
      {
        name: '已完成'
      },
      {
        name: '未完成'
      }],
      completeNum: 0,
      unCompleteNum: 0,
      beCompleteNum: 0,
      completeList: [],
      unCompleteList: [],
      beCompleteList: [],
      chooseMonth: '',
      year: new Date().getFullYear(),
      userName: store.userInfo.userName,
      img: store.userInfo.photoUrl,
      flag: false
    }
  },
  created () {
    this.chooseMonth = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
    this.month = this.$tools.getQuery().get("date").replace(/-/g, '/').substring(0, 7)
    this.myTaskStaticGet()
  },
  methods: {
    confirm (e) {
      this.flag = false
      this.month = `${e.year}/${e.month}`
      this.chooseMonth = e.month
      this.year = e.year
      this.myTaskStaticGet()
    },
    async myTaskStaticGet () {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        userCode: store.userInfo.userCode,
        month: this.month.replace(/\//g, '-')
      }
      const res = await actions.getMyTaskStatic(req)
     	res.data.map(el => {
         if (el.state === '0') {
           this.beCompleteNum = el.num
           this.beCompleteList = el.dayTaskStatic
         } else if(el.state === '1') {
           this.completeNum = el.num
           this.completeList = el.dayTaskStatic
         } else {
            this.unCompleteNum = el.num
            this.unCompleteList = el.dayTaskStatic
         }
       })
       this.flag = true
    },
    detail (item) {
      item.wdate = this.$tools.getDateTime(item.wdate,'date').substring(0,11) + ' ' + '23:59:59'
      const data = item.wdate.substring(0,11).replace(/-/g, '/')
      this.$tools.navTo({
				url: `./list?code=${store.userInfo.userCode}&date=${item.wdate}&type=1`,
				title: `${store.userInfo.userName}(${data})`
			})
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
  height: 100vh;
  .item-info {
    height: 350rpx;
    background: url('/mobile-img/safe-my.png') no-repeat; 
    background-size: 100% 95%;
    position: relative;
    .info-date {
      position: absolute;
      top: 60rpx;
      right: 0;
      width: 200rpx;
      height: 56rpx;
      line-height: 56rpx;
      background-color:#1A91FF;
      color: #fff; 
      border-top-left-radius: 30rpx;
      border-bottom-left-radius: 30rpx;
      text-align: center;
      align-items: center;
      image {
        width: 26rpx;
        height: 28rpx;
      }
    }
    .info-title {
      position: absolute;
      bottom: 0;
      width: 125rpx;
      height: 45rpx;
      line-height: 40rpx;
      background-color: #0084FF;
      color:#fff;
      border: 1px solid #fff;
      border-radius: 20rpx;
      text-align: center;
    }
    .item-status {
      width: 132rpx;
      height: 132rpx;
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .info-name {
      color:#fff;
    }
  }
  .content-title {
    height: 90rpx;
    align-items: center;
  }
  .add-item {
    align-items: center;
  }
  .collapse-box {
    margin-top: -20rpx;
  }
}
</style>
