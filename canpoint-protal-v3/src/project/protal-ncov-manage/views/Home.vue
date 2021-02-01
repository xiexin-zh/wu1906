<template>
  <div class="ncov-home page-layout u-fx-ver">
    <div class="u-type-white-bg u-padd-10 u-border-radius">
      <div class="u-fx-jsb">
        <div class="title">今日测温</div>
        <div>
          测温统计：
          <u-radio v-model="timeType" :item-list="tempList" @change="typeChange"></u-radio>
        </div>
      </div>
      <div class="list-box u-fx">
        <div v-for="(today, index) in todayList" :key="index" class="list u-fx-f1 u-fx-ac u-fx-jc">
          <img :src="today.icon" class="u-mar-r20" alt />
          <div class="number-box u-fx-ac-jc">
            <div class="number u-font-3 u-bold u-mar-b10">{{ today.total }}</div>
            <div class="number u-tips-color u-tx-c">{{ today.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="u-type-white-bg u-fx-f1 u-fx-ver u-padd-10 u-mar-t10 u-mar-b10 u-border-radius">
      <div class="title">近14日发热人数走势</div>
      <div class="u-fx-f1">
        <u-charts
          v-if="keyOne"
          yLineColor="#eee"
          type="areaspline"
          yTitle="人数"
          :isLegend="false"
          yTitleColor="#333"
          legendColor="#333"
          xColor="#333"
          yColor="#333"
          xLineColor="#eee"
          yGridColor="#eee"
          plotColor="#333"
          id="line-one"
          :categories="userCategories1"
          :series="userSeries1"
          plotBorderWidth="3"
        ></u-charts>
      </div>
    </div>
    <div class="u-type-white-bg u-fx-f1 u-fx-ver u-padd-10 u-border-radius">
      <div class="title">近14日未上报人数走势</div>
      <div class="u-fx-f1">
        <u-charts
          v-if="keyTwo"
          type="areaspline"
          yTitle="人数"
          :isLegend="false"
          yTitleColor="#333"
          legendColor="#333"
          xColor="#333"
          yColor="#333"
          xLineColor="#eee"
          yLineColor="#eee"
          yGridColor="#eee"
          plotColor="#333"
          id="line-two"
          :categories="userCategories2"
          :series="userSeries2"
          plotBorderWidth="3"
        ></u-charts>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import school from '../assets/img/school.png'
import noReport from '../assets/img/not_report.png'
import fever from '../assets/img/fever.png'
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      keyOne: false,
      keyTwo: false,
      todayList: [
        {
          icon: school,
          title: '已上报(人)',
          total: '--'
        },
        {
          icon: noReport,
          title: '未上报(人)',
          total: '--'
        },
        {
          icon: fever,
          title: '发热(人)',
          total: '--'
        }
      ],
      timeType: '',
      tempList: [],
      searchList: {
        date: this.$tools.getDate(new Date(), 1),
        schoolCode: 'CANPOINTLIVE'
      },
      userCategories1: [],
      userSeries1: [
        {
          name: '发热',
          color: '#ff0000',
          data: new Array(14).fill(0)
        }
      ],
      userCategories2: [],
      userSeries2: [
        {
          name: '未上报',
          color: 'rgb(0, 186, 255)',
          data: new Array(14).fill(0)
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  created() {},
  mounted() {
    this.userCategories1 = this.getLastDay(14)
    this.userCategories2 = this.getLastDay(14)
    this.planListGet()
    this.feverAndHealthGet()
    this.noReportGet()
  },
  methods: {
    ...mapActions('home', ['getTempPlan', 'getFeverAndHealth', 'getNoReport', 'getDailyData']),
    // 获取测温计划时间列表
    async planListGet() {
      const req = {
        schoolCode: this.schoolCode,
        thermometryDate: this.$tools.getDate(new Date(), 1)
      }
      const res = await this.getTempPlan(req)
      this.tempList = res.data.map(el => {
        return {
          label: el.planName,
          value: `${el.startTime}+${el.endTime}`
        }
      })
      if (res.data.length > 0) {
        const data = res.data[0]
        this.timeType = `${data.startTime}+${data.endTime}`
        this.searchList.startTime = this.$tools.getDate(data.startTime, 2, 's')
        this.searchList.endTime = this.$tools.getDate(data.endTime, 2, 's')
        this.showList()
      }
    },
    // 切换晨午检
    typeChange(value) {
      this.timeType = value
      const time = value.split('+')
      this.searchList.startTime = this.$tools.getDate(Number(time[0]), 2, 's')
      this.searchList.endTime = this.$tools.getDate(Number(time[1]), 2, 's')
      this.showList()
    },
    // 获取测温计划数据
    async showList() {
      const req = {
        ...this.searchList
      }
      const res = await this.getDailyData(req)
      this.todayList[0].total = res.data.upRecordCount
      this.todayList[1].total = res.data.noRecordCount
      this.todayList[2].total = res.data.feverCount
    },
    // 获取发热人员数据
    async feverAndHealthGet() {
      const req = {
        ...this.searchList,
        schoolCode: this.schoolCode,
        startDate: this.$tools.getDate(new Date().getTime() - 13 * 24 * 60 * 60 * 1000, 1),
        endDate: this.$tools.getDate(new Date(), 1)
      }
      const res = await this.getFeverAndHealth(req)
      // 找出有访客对应日期的索引
      const _index = []
      this.userCategories1.forEach((item, index) => {
        const ind = res.data.findIndex(it => {
          return this.$tools.getDate(it.date, 1).substr(5, 9) === item
        })
        if (ind > -1) {
          _index.push(index)
        }
      })
      _index.forEach((item, index) => {
        this.userSeries1[0].data[item] = res.data[index].count
      })
      this.keyOne++
    },
    // 获取未上报人数
    async noReportGet() {
      const req = {
        ...this.searchList,
        schoolCode: this.schoolCode,
        startDate: this.$tools.getDate(new Date().getTime() - 13 * 24 * 60 * 60 * 1000, 1),
        endDate: this.$tools.getDate(new Date(), 1)
      }
      const res = await this.getNoReport(req)
      // 找出有访客对应日期的索引
      const _index = []
      this.userCategories2.forEach((item, index) => {
        const ind = res.data.findIndex(it => {
          return this.$tools.getDate(it.date, 1).substr(5, 9) === item
        })
        if (ind > -1) {
          _index.push(index)
        }
      })
      _index.forEach((item, index) => {
        this.userSeries2[0].data[item] = res.data[index].count
      })
      this.keyTwo++
    },
    getLastDay(total) {
      const date = new Date().getTime()
      const dateArr = []
      for (let i = 0; i < total; i++) {
        const times = date - 1000 * 60 * 60 * 24 * i
        dateArr.push(this.$tools.getDate(times, 1).substr(5, 9))
      }
      return dateArr.reverse()
    }
  }
}
</script>
<style lang="less" scoped>
.ncov-home {
  .title {
    font-size: 16px;
    height: 50px;
  }
}
.list-box {
  height: 100px;
}
</style>
