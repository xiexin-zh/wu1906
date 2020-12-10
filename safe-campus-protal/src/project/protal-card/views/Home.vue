<template>
  <div class="page-layout qui-fx-ver home">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <count-detail
      ref="countDetail"
      v-if="showDetailTag"
      v-model="showDetailTag"
      :columns="columns"
      :rangeTime="rangeTime"
      :chooseType="chooseType"
      :title="detailTitle">
    </count-detail>
    <div>
      <div class="attend-card qui-fx-ver" v-for="(teacher, index) in teacherData" :key="index" @click="showDetail(teacher.key)">
        <ul class="box">
          <li class="tip">{{ teacher.title }}</li>
          <li class="total">{{ teacher.total }}</li>
          <li class="count">{{ teacher.tip }}笔</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from '@c/SearchForm'
import CountDetail from '../component/CountDetail'
import columnList from '../assets/table/consumeColumns'
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
    CountDetail
  },
  data() {
    return {
      searchLabel,
      moment,
      columnList,
      columns: [],
      teacherData: [],
      chooseType: '1',
      showDetailTag: false,
      rangeTime: [],
      detailTitle: '消费明细'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showCount()
  },
  methods: {
    ...mapActions('home', ['getCount']),
    searchForm(values) {
      // console.log()
      this.rangeTime = values.rangeTime
      this.showCount()
    },
    async showCount() {
      const req = {
        createTime: this.rangeTime[0] ? `${this.rangeTime[0]} 00:00:00` : '',
        endTime: this.rangeTime[1] ? `${this.rangeTime[1]} 00:00:00` : ''
      }
      const res = await this.getCount(req)
      const data = res.data
      this.teacherData = [
        {
          title: '充值',
          total: data.totalRechargeAmount ? data.totalRechargeAmount : 0,
          tip: data.totalRechargeNumber,
          key: '2'
        },
        {
          title: '补助',
          total: data.totalSubsidyAmount ? data.totalSubsidyAmount : 0,
          tip: data.totalSubsidyNumber,
          key: '3'
        },
        {
          title: '扣款',
          total: data.totalDeductionAmount ? data.totalDeductionAmount : 0,
          tip: data.totalDeductionNumber,
          key: '4'
        },
        {
          title: '消费',
          total: data.totalAmount ? data.totalAmount : 0,
          tip: data.totalNumber,
          key: '1'
        },
        {
          title: '退款',
          total: data.totalRefundsAmount ? data.totalRefundsAmount : 0,
          tip: data.totalRefundsNumber,
          key: '5'
        }
      ]
    },
    showDetail(key) {
      this.chooseType = key
      if (key === '1') {
        this.detailTitle = '消费明细'
        this.columns = this.columnList.consumeColumns.slice(0, -1)
      } else if (key === '2') {
        this.detailTitle = '充值明细'
        this.columns = this.columnList.rechargeColumns
      } else if (key === '3') {
        this.detailTitle = '补助明细'
        this.columns = this.columnList.subsidyColumns
      } else if (key === '4') {
        this.detailTitle = '扣款明细'
        this.columns = this.columnList.deducColumns
      } else if (key === '5') {
        this.detailTitle = '退款明细'
        this.columns = this.columnList.refundColumns
      }
      this.showDetailTag = true
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  background-color: #fff;
  .attend-card {
    padding: 10px 20px;
    margin-top: 20px;
    width: 22.5%;
    float: left;
    margin-left: 2%;
    height: 180px;
    .box{
      margin:auto 0 ;
    }
    .tip {
      font-size: 18px;
      color: #fff;
    }
    .total {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
    }
    .count{
      width: 85px;
      height: 25px;
      line-height: 25px;
      background-color: #fff;
      border-radius: 10px;
      text-align: center;
    }
    &:nth-child(1) {
      color: #5C71F6;
      background: url('../../../assets/img/cz.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(2) {
      color: #398FE2;
      background: url('../../../assets/img/bz.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(3) {
      color: #DC9B5B;
      background: url('../../../assets/img/kk.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(4) {
      color: #44CC61;
      background: url('../../../assets/img/xf.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(5) {
      color: #D45E5E;
      background: url('../../../assets/img/tk.png') no-repeat center;
      background-size: 100% 100%;
    }
  }
}
</style>
