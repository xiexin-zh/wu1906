<template>
  <view class="abnormal-total">
    <view class="banner-img banner-kqtj"></view>
		<choose-child @change="childInfo"></choose-child>
    <view id="total-pic" class="u-bg-fff"></view>
    <view class="mar-top20">
      <search-time type="year-month" v-model="dormDate" @get-time="getTime">
        <view>异常统计(次/月)</view>
      </search-time>
      <view class="abnormal-module">
        <view @click="goDetail(2, 2, total.lateCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.lateCount }}</view>
          </view>
          <view class="total-text">晚归次数</view>
        </view>
        <!-- <view @click="goDetail(3, 1, total.lateNightCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.lateNightCount }}</view>
          </view>
          <view class="total-text">深夜外出次数</view>
        </view> -->
        <view @click="goDetail(3, 2, total.notBackCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.notBackCount }}</view>
          </view>
          <view class="total-text">未归次数</view>
        </view>
        <view @click="goDetail(1, 2, total.vacateCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.vacateCount }}</view>
          </view>
          <view class="total-text">请假次数</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import mixins from '../../../utils/mixins.js';
import SearchTime from '../component/SearchTime';
import { store, actions } from '../store/index.js';
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
export default {
  name: 'AbnormalTotalP',
  mixins: [mixins],
  components: {
    SearchTime,
		chooseChild
  },
  data () {
    return {
      currentIndex: 0,
      dormDate: '',
      total: {
        lateCount: 0,
        lateNightCount: 0,
        notBackCount: 0,
        vacateCount: 0
      },
			userCode: ''
    }
  },
  created () {
		this.userCode = store.childList[0].userCode;
		this.dormDate = this.gmtToDate(new Date().getTime() - 3600 * 24 * 1000).substring(0, 10)
		this.showTotal(this.userCode)
  },
  mounted () {
  },
  methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this.showTotal();
			}
		},
    showTotal () {
      actions.childException({
        listUser: [this.userCode],
        schoolCode: store.userInfo.schoolCode,
        wdate: this.dormDate + '-10'
      }).then(res => {
        this.total = res.data
        this.drawLine(res.data)
      })
    },
    goDetail (checkStatus, checkType, num) {
      if (parseInt(num) === 0) return
      let _self = this
			this.$tools.navTo({
				url: './detail?checkStatus=' + checkStatus + '&checkType=' + checkType + '&wdate=' + _self.dormDate + '&listUser=' + this.userCode
			});
    },
    getTime () {
      this.showTotal()
    },
    changeMenu (id) {
    },
    drawLine (res) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('total-pic'))
      // 绘制图表
      myChart.setOption({
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b} : {c} ({d}%)'
        // },
        color: ['#d1ade6', '#b0a4e3', '#74b8da', '#869dc6'],
        legend: {
          orient: 'vertical',
          selected: {
          },
          top: 90,
          left: 'right',
          data: [`晚归-${res.lateCount}`, /* `深夜外出-${res.lateNightCount}`, */ `未归-${res.notBackCount}`, `请假-${res.vacateCount}`]
        },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: '55%',
            center: ['35%', '45%'],
            data: [
              { value: res.lateCount, name: `晚归-${res.lateCount}` },
              /* { value: res.lateNightCount, name: `深夜外出-${res.lateNightCount}` }, */
              { value: res.notBackCount, name: `未归-${res.notBackCount}` },
              { value: res.vacateCount, name: `请假-${res.vacateCount}` }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	.banner-img {
		width: 100%;
		height: 240rpx;
		background: url('http://canpointtest.com/mobile-img/kqtj.png') no-repeat;
		background-size: 100% 240rpx;
	}
  .child-list {
    padding: 15rpx;
    span {
      padding: 6rpx 20rpx;
      border-radius: 15rpx;
      margin: 0 20rpx;
      &.act {
        background-color: $u-type-primary;
        color: #fff;
      }
    }
  }
  #total-pic {
    margin: 0 15rpx 15rpx 15rpx;
    height: 400rpx;
  }
  .abnormal-module {
    overflow: auto;
    padding-bottom: 30rpx;
  }
  .abnormal-list {
    padding: 20rpx;
    height: 200rpx;
    width: 45%;
    border-radius: 8rpx;
    float: left;
    margin-left: 3.33%;
    margin-top: 3.33%
  }
  .total-num {
    font-size: 50rpx;
    font-weight: bold
  }
  .total-text {
    color:$u-content-color;
    font-size: 30rpx;
    padding-top: 40rpx;
  }
  .div-shadow {
    box-shadow: 2rpx 2rpx 8rpx $u-light-color;
    overflow: hidden;
  }
</style>
