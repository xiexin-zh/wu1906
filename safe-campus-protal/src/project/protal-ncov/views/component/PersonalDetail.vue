<template>
  <div class="leave-detail qui-fx-f1 qui-fx-ver">
    <div class="pos-box" style="overflow-y: scroll">
      <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
        <a-menu-item key="title">基本信息</a-menu-item>
      </a-menu>
      <div class="process qui-fx-jsb qui-fx-ac">
        <div class="qui-fx-jsa qui-fx-ac">
          <img :src="detailInfo.photoUrl" alt />
          <div class="qui-fx-ver">
            <a-row class="padd-l10">
              <a-col class="mar-b10" :span="12">姓名 : {{ detailInfo.userName }}</a-col>
              <a-col
                class="mar-b10"
                :span="12"
              >性别 : {{ detailInfo.sex == '2' ? '女' : detailInfo.sex == '1' ? '男' : '未知' }}</a-col
              >
              <a-col
                class="mar-b10"
                :span="12"
                v-if="$route.query.userType == 4"
              >组织机构 : {{ detailInfo.orgName }}</a-col
              >
              <a-col
                class="mar-b10"
                :span="12"
                v-else
              >班级 : {{ (schoolType === '8' || schoolType === '9') ? detailInfo.schoolYearId : '' }}{{ detailInfo.gradeName }}{{ detailInfo.className }}</a-col
              >
              <a-col class="mar-b10" :span="12">建档时间 : {{ getDateTime(detailInfo.createTime) }}</a-col>
            </a-row>
          </div>
        </div>
      </div>
      <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
        <a-menu-item key="title">体温走势</a-menu-item>
      </a-menu>
      <div style="margin-top:10px;">
        <chart-component :style="{ height: chartHeight }" :id="unReportId" :option="unReportOption"></chart-component>
      </div>
      <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
        <a-menu-item key="title">疫情上报记录</a-menu-item>
      </a-menu>
      <div class="qui-fx-f1 qui-fx-ver">
        <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="detailList">
          <template v-slot:other1="other1"> {{ other1.record.gradeName }}{{ other1.record.className }} </template>
          <template v-slot:other5="action">
            <div v-if="action.record.enableFever === false">{{ action.record.enableFever ? '发热' : '未发热' }}</div>
            <a-tag color="#e80000" v-else>{{ action.record.enableFever ? '发热' : '未发热' }}</a-tag>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="getReportList"></page-num>
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import ChartComponent from '../component/ChartComponent'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import NoData from '@c/NoData'
import Tools from '@u/tools'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '男'
      } else if (text === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '发热状态',
    width: '8%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '8%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '8%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '16%',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
export default {
  name: 'PersonalDetail',
  components: {
    TableList,
    PageNum,
    ChartComponent,
    NoData
  },
  data() {
    return {
      moment,
      msg: '',
      noData: false,
      pageList: {
        userCode: '',
        page: 1,
        size: 20
      },
      unReportId: 'unReportId',
      unReportOption: {},
      total: 0,
      columns,
      detailList: [],
      detailInfo: [],
      reportTime: [],
      temperature: [],
      schoolType: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.schoolType = this.userInfo.schoolType
    if (this.$route.query.userType === '8') {
      this.columns[3].title = '班级'
      this.columns[3].dataIndex = 'className'
      this.columns[4].title = '学号'
      this.columns[3].scopedSlots = {
        customRender: 'other1'
      }
    }
    this.getTemperature()
    this.showList()
    this.getReportList()
    for (var i = 0; i < 14; i++) {
      this.reportTime.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i))).format('YYYY-MM-DD'))
      this.temperature.unshift(0)
    }
  },
  created() {
    this.chartHeight = document.body.clientHeight * 0.35 + 'px'
  },
  methods: {
    ...mapActions('home', ['getReportInfo', 'getarchivesDetail', 'getTemperatureData']),
    async showList() {
      const userCode = this.$route.query.id
      const userType = this.$route.query.userType
      const req = `${userType}/${userCode}`
      const res = await this.getarchivesDetail(req)
      this.detailInfo = res.data
    },
    async getTemperature() {
      const res = await this.getTemperatureData({
        userCode: this.$route.query.id,
        // startDate: this.getDateTime(new Date().setMonth(new Date().getMonth() - 1)),
        startDate: this.getDateTime(new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)),
        endDate: this.getDateTime(new Date())
      })
      if (res.data) {
        let i
        res.data.forEach(ele => {
          if (ele.temperature === null) {
            ele.temperature = 0
          }
          this.reportTime.filter((item, index) => {
            if (item === moment(ele.date).format('YYYY-MM-DD')) {
              i = index
            }
          })
          this.temperature[i] = ele.temperature
        })
      }
      this.initUnReportChart(this.feverData, this.xDate)
    },
    async getReportList() {
      this.pageList.userCode = this.$route.query.id
      const res = await this.getReportInfo(this.pageList)
      this.detailList = res.data.list
      this.total = res.data.total
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
      )
    },
    initUnReportChart(feverData, xDate) {
      this.unReportOption = {
        chart: {
          type: 'areaspline'
        },
        title: {
          text: ''
        },
        legend: {
          verticalAlign: 'top',
          margin: 5,
          align: 'right'
        },
        xAxis: {
          type: 'datetime',
          categories: this.reportTime
        },
        credits: {
          enabled: false
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        tooltip: {
          pointFormat: '{series.name} <b>{point.y}</b>℃'
        },
        plotOptions: {
          area: {
            pointStart: 2,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true
                }
              }
            }
          }
        },
        series: [
          {
            name: '体温',
            color: 'rgb(105, 167, 254)',
            data: this.temperature
          }
        ]
      }
      this.unReportChart = new Highcharts.Chart(this.unReportId, this.unReportOption)
    }
  }
}
</script>
<style lang="less" scoped>
.leave-detail {
  overflow-y: scroll !important;
  overflow-x: hidden;
}
.leave-detail {
  background: #fff;
  .info,
  .pic {
    margin-top: 20px;
    padding: 0 20px;
    p {
      margin-right: 50px;
      span {
        margin: 0 5px;
      }
    }
  }
  .pic {
    margin-top: 0;
  }
  .title {
    margin: 10px;
    p {
      margin: 0;
      font-weight: bold;
    }
  }
  .process {
    width: 600px;
    margin: 20px;
    img {
      width: 60px;
      height: 60px;
      background: #ddd;
      margin-right: 10px;
    }
  }
}
</style>
