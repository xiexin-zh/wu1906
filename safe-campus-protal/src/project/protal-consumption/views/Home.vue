<template>
  <div class="page-layout u-fx-ver card-home">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div class="u-auto">
      <div class="view-card qui-fx-ver" v-for="(view, index) in viewList" :key="index">
        <ul class="box">
          <li class="tip">{{ view.title }}</li>
          <li class="total">￥{{ view.total }}</li>
          <li class="count">{{ view.tip }}笔</li>
        </ul>
      </div>
    </div>
    <div class="u-fx-f1 u-fx-ver show-bi">
      <div class="title">每日消费动态</div>
      <div class="u-fx-f1 u-mar-t">
        <money-show ref="monyShow" :categories="xData" :yData="yData"></money-show>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from '@c/SearchForm'
import MoneyShow from './MoneyShow'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '日期',
    initValue: [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]
  }
]
export default {
  name: 'AttendanceData',
  components: {
    SearchForm,
    MoneyShow
  },
  data() {
    return {
      searchLabel,
      rangeTime: [],
      viewList: [
        {
          title: '消费',
          total: '0',
          tip: '0'
        },
        {
          title: '充值',
          total: '0',
          tip: '0'
        },
        {
          title: '补助',
          total: '0',
          tip: '0'
        },
        {
          title: '退款',
          total: '0',
          tip: '0'
        },
        {
          title: '余额清零',
          total: '0',
          tip: '0'
        }
      ],
      xData: [],
      yData: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._showDynamic()
    this._showCount()
  },
  methods: {
    ...mapActions('home', ['getCount', 'getDynamic']),
    searchForm(values) {
      this.rangeTime = values.rangeTime
      this._showCount()
    },
    /**
     * @description 数据统计
     */
    async _showCount() {
      const req = {
        beginTime: this.rangeTime[0] || moment(new Date()).format('YYYY-MM-DD'),
        endTime: this.rangeTime[1] || moment(new Date()).format('YYYY-MM-DD'),
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getCount(req)
      this.viewList = res.data.map(item => {
        return {
          ...item,
          title: this.tradeType(item.tradeType),
          total: item.amountNum,
          tip: item.countNum
        }
      })
    },
    tradeType(text) {
      text = parseInt(text)
      if (text === 1) {
        return '消费'
      } else if (text === 2) {
        return '充值'
      } else if (text === 3) {
        return '补助'
      } else if (text === 4) {
        return '退款'
      } else if (text === 5) {
        return '余额清零'
      }
    },
    /**
     * @description 消费动态
     */
    async _showDynamic() {
      for (var i = 0; i < 30; i++) {
        this.xData.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i))).format('YYYY-MM-DD'))
        this.yData.unshift({
          countNum: 0,
          amountNum: 0,
          dayStr: moment(new Date(new Date().setDate(new Date().getDate() - i))).format('YYYY-MM-DD')
        })
      }
      const res = await this.getDynamic({ schoolCode: this.userInfo.schoolCode })
      if (res.data) {
        res.data.forEach(ele => {
          const index = this.xData.findIndex(list => {
            return list === moment(ele.dayStr).format('YYYY-MM-DD')
          })
          if (index !== -1) {
            this.yData[index].countNum = ele.countNum
            this.yData[index].amountNum = ele.amountNum
            this.yData[index].dayStr = ele.dayStr
          }
        })
      }
      this.xData = this.xData.map(ele => {
        return ele.substring(ele.length - 5)
      })
      console.log(this.xData)
      console.log(this.yData)
      this.$refs.monyShow.showTab()
    }
  }
}
</script>
<style lang="less" scoped>
.card-home {
  padding-top: 20px;
  .show-bi {
    margin: 20px 20px 0;
    .title {
      height: 18px;
      line-height: 18px;
      font-weight: bold;
      border-left: 3px #9698d6 solid;
      padding-left: 10px;
    }
  }

  .view-card {
    padding: 10px 20px;
    margin-top: 20px;
    width: 18%;
    float: left;
    margin-left: 1.66%;
    height: 180px;
    .box {
      margin: auto 0;
    }
    .tip {
      font-size: 18px;
      color: #fff;
    }
    .total {
      font-size: 32px;
      padding: 10px 0;
      font-weight: bold;
      color: #fff;
    }
    .count {
      width: 85px;
      height: 25px;
      line-height: 25px;
      background-color: #fff;
      border-radius: 10px;
      text-align: center;
    }
    &:nth-child(1) {
      color: #44cc61;
      background: url(../assets/img/xf-bg.png) no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(2) {
      color: #6176fe;
      background: url('../assets/img/cz-bg.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(3) {
      color: #398fe2;
      background: url('../assets/img/bz-bg.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(4) {
      color: #dc9b5b;
      background: url('../assets/img/tk-bg.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(5) {
      color: #d45e5e;
      background: url('../assets/img/ye-bg.png') no-repeat center;
      background-size: 100% 100%;
    }
  }
}
</style>
