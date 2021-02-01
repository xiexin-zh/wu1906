<template>
  <view class="abnormal-total">
    <view class="banner-img banner-kqtj"></view>
    <view id="total-pic" class="u-bg-fff"></view>
    <view class="mar-top20">
      <search-time v-model="dormDate" @get-time="getTime">
        <view>
          {{ dormDate | getDay}}
        </view>
      </search-time>
      <view class="abnormal-module">
        <view @click="goDetail(2, 2, total.lateCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.lateCount }}</view>
          </view>
          <view class="total-text">晚归人数</view>
        </view>
        <!-- <view @click="goDetail(3, 1, total.lateNightCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.lateNightCount }}</view>
          </view>
          <view class="total-text">深夜外出人数</view>
        </view> -->
        <view @click="goDetail(3, 2, total.notBackCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.notBackCount }}</view>
          </view>
          <view class="total-text">未归人数</view>
        </view>
        <view @click="goDetail(1, 2, total.vacateCount)" class="abnormal-list div-shadow u-bg-fff">
          <view class="u-fx u-fx-jsb">
            <view class="total-num">{{ total.vacateCount }}</view>
          </view>
          <view class="total-text">请假人数</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mixins from '../../../utils/mixins.js';
import SearchTime from '../component/SearchTime';
import { store, actions } from '../store/index.js';
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
export default {
  name: 'AbnormalTotal',
  mixins: [mixins],
  components: {
    SearchTime
  },
  data () {
    return {
      dormDate: '',
      total: {
        lateCount: 0,
        lateNightCount: 0,
        notBackCount: 0,
        vacateCount: 0,
				deptType: '',
				deptCode: ''
      }
    }
  },
  created () {
		this.dormDate = this.gmtToDate(new Date().getTime() - 3600 * 24 * 1000).substring(0, 10)
		this.$tools.isBZR(store.userInfo).then(res => {
			if (res) {
				this.deptType = '1'
				this.deptCode = res[0].classCode;
			}else{
				this.$tools.isDormMamage(store.userInfo).then(res => {
					console.log(res)
					if (res) {
						this.deptType = '2'
						this.deptCode = res.buildingCode;
					}
				});
			}
		});
		this.$tools.goNext(()=>{
			this.showTotal(this.dormDate)
		})
  },
  mounted () {
  },
  methods: {
    showTotal (wdate) {
			console.log(this.deptCode)
			if(!this.deptCode){
				return
			}
      actions.getExceptionTotal({
        schoolCode: store.userInfo.schoolCode,
        deptType: this.deptType,
        deptCode: this.deptCode,
        wdate: this.dormDate
      }).then(res => {
        this.total = res.data
        this.drawLine(res.data)
      })
    },
    goDetail (checkStatus, checkType, num) {
      if (parseInt(num) === 0) return
      let _self = this
			this.$tools.navTo({
				url: './detail?checkStatus=' + checkStatus + '&checkType=' + checkType + '&deptType=' + this.deptType + '&deptCode=' + this.deptCode + '&wdate=' + _self.dormDate
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
        color: ['#d1ade6', '#b0a4e3', '#74b8da'],
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
  #total-pic {
    margin: 15rpx;
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
    margin-bottom: 30rpx
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
