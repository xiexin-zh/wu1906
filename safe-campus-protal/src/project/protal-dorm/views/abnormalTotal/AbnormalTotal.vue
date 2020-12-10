<template>
  <div class="checkdorm-page" v-cloak>
    <a-modal :title="dialogTitle" v-model="knowDetailTag" :footer="null" width="1100px">
      <a-table
        :rowKey="(record, index) => index"
        :pagination="false"
        :columns="excDetail"
        :dataSource="excTableDetail"
        :scroll="{ y: 540 }"
      >
        <template slot="number" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </template>
        <template slot="recordTime" slot-scope="recordTime">
          <span>{{ getDateTime(recordTime, 1) }}</span>
        </template>
        <template slot="photoSrc" slot-scope="photoSrc">
          <div class="person-bg-img">
            <img :src="photoSrc" class="photo-bg-img" alt="" />
          </div>
        </template>
        <template slot="snapSrc" slot-scope="snapSrc">
          <div class="person-bg-img">
            <img :src="snapSrc" class="photo-bg-img" alt="" />
          </div>
        </template>
      </a-table>
    </a-modal>
    <div class="tab-tree">
      <org-tree :current-tab="0" :is-select="true" :is-tab="isTab" @tree-click="handleTreeClick"></org-tree>
    </div>
    <div class="checkdorm-right">
      <a-row type="flex" justify="end" align="middle" class="search-form">
        <a-col>
          <span class="input-name">日期：</span>
          <a-range-picker v-model="searchTime" />
          <a-button @click="searchList" type="primary" style="margin-left: 10px;">查询</a-button>
        </a-col>
      </a-row>
      <div style="height: 320px;width:calc(100% - 100px)" id="main_line"></div>
      <div class="table_data">
        <a-table
          :rowKey="record => record.wdate"
          :pagination="false"
          :columns="columns"
          :dataSource="excTableData"
          :scroll="{ y: tableHeight1 }"
        >
          <template slot="number" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template>
            <span slot="customTitle">{{ this.currentActiveTab === 1 ? '宿舍名称' : '年级/班级名称' }}</span>
          </template>
          <template slot="lateNum" slot-scope="lateNum, record">
            <a-tag @click="checkInfo(2, lateNum, record.wdate, '晚归', record.dormName)" color="#f50">{{
              lateNum
            }}</a-tag>
          </template>
          <!-- <template slot="nightOutNum" slot-scope="nightOutNum, record">
            <a-tag @click="checkInfo(3, nightOutNum, record.wdate, '深夜外出', record.dormName)" color="#cc0000">{{
              nightOutNum
            }}</a-tag>
          </template> -->
          <template slot="noReturnNum" slot-scope="noReturnNum, record">
            <a-tag @click="checkInfo(3, noReturnNum, record.wdate, '未归', record.dormName)" color="#ccc">{{
              noReturnNum
            }}</a-tag>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import OrgTree from '../components/orgTree/OrgTree'
import konwTable from '../../assets/js/table/knowDetail'
import { mapActions } from 'vuex'
import mixins from '@u/mixins'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '8%',
    scopedSlots: {
      customRender: 'number'
    }
  },
  {
    title: '日期',
    dataIndex: 'wdate',
    width: '19%'
  },
  {
    slots: { title: 'customTitle' },
    dataIndex: 'dormName',
    width: '19%'
  },
  {
    title: '晚归人数',
    dataIndex: 'lateNum',
    width: '19%',
    scopedSlots: {
      customRender: 'lateNum'
    }
  },
  /*   {
    title: '深夜外出人数',
    dataIndex: 'nightOutNum',
    width: '19%',
    scopedSlots: {
      customRender: 'nightOutNum'
    }
  }, */
  {
    title: '未归人数',
    dataIndex: 'noReturnNum',
    width: '19%',
    scopedSlots: {
      customRender: 'noReturnNum'
    }
  }
]

export default {
  name: 'AbnormalTotal',
  components: {
    OrgTree
  },
  mixins: [mixins],
  data() {
    return {
      knowDetailTag: false,
      dialogTitle: '',
      columns,
      isTab: true,
      searchForm: {
        buildingCode: null, // 宿舍
        classCode: null, // 班级
        endDate: '',
        floorCode: null, // 楼层
        gradeCode: null, // 年级
        roomCode: null, // 房间
        schoolCode: sessionStorage.getItem('schoolScheme'), // 学校code
        stageCode: null, // 学阶
        startDate: ''
      },
      searchTime: null,
      selectNodetitle: '',
      excTableData: [],
      excTableDetail: [],
      excDetail: konwTable(),
      currentActiveTab: 0
    }
  },
  methods: {
    ...mapActions('checkTotal', ['getExcList', 'getExcListDetail']),
    checkInfo(type, num, date, title, dormName) {
      if (num === 0) return
      if (type === 3) {
        this.excDetail = konwTable(2)
      } else {
        this.excDetail = konwTable()
      }
      this.getExcListDetail({
        buildingCode: this.searchForm.buildingCode, // 楼栋编码
        checkStatus: type,
        classCode: this.searchForm.classCode, // 班级编码
        floorCode: this.searchForm.floorCode, // 楼层编码
        gradeCode: this.searchForm.gradeCode, // 年级编码
        roomCode: this.searchForm.roomCode, // 房间编码
        schoolCode: this.searchForm.schoolCode, // 学校编码 必填
        stageCode: this.searchForm.stageCode, // 学阶编码
        wdate: date, // 哪一天的详情数据 必填
        schoolYearId: this.searchForm.schoolYearId ? this.searchForm.schoolYearId : ''
      }).then(res => {
        this.excTableDetail = res.data
        this.dialogTitle = title
        this.dialogTitle = dormName + '-' + title + num + '人' + '(' + date + ')'
        this.knowDetailTag = true
      })
    },
    getCheckDormTableData() {
      const req = this.searchForm
      if (this.searchTime == null || this.searchTime.length === 0) {
        this.searchForm.startDate = this.getCurrentTimeAndOneMonth(0)
        this.searchForm.endDate = this.getCurrentTimeAndOneMonth(1)
      } else {
        this.searchForm.startDate = this.searchTime[0]
        this.searchForm.endDate = this.searchTime[1]
      }
      this.getExcList(req)
        .then(res => {
          this.excTableData = res.data
          this.excTableData.forEach((item, index) => {
            this.$set(item, 'index', index)
            this.$set(item, 'dormName', this.selectNodetitle)
            item.wdate = this.getdate(item.wdate).split(' ')[0]
          })
          const chartData = res.data.concat()
          this.setChart(chartData.reverse())
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    setChart(data) {
      var timeList = []
      var wangData = []
      var sywcData = []
      var weigData = []
      var qjData = []
      for (var i = 0, l = data.length; i < l; i++) {
        timeList.push(this.getdate(data[i].wdate).substring(0, 10))
        wangData.push(data[i].lateNum)
        sywcData.push(data[i].nightOutNum)
        weigData.push(data[i].noReturnNum)
        qjData.push(data[i].leaveNum)
      }
      var myChart = echarts.init(document.getElementById('main_line'))
      var colors = ['#5793f3', '#d14a61', '#675bba', '#cccccc']
      // 指定图表的配置项和数据
      var option = {
        grid: {
          left: '5%',
          top: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        textStyle: {
          color: '#5793f3'
        },
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['晚归', /* '深夜外出', */ '未归']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0]
              }
            },
            data: []
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            data: []
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[2]
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '晚归',
            type: 'line',
            // xAxisIndex: 1,
            smooth: true,
            data: []
          },
          /* {
            name: '深夜外出',
            type: 'line',
            smooth: true,
            data: []
          }, */
          {
            name: '未归',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      }
      option.xAxis[0].data = timeList
      option.xAxis[1].data = timeList
      option.xAxis[2].data = timeList
      option.series[0].data = wangData
      /* option.series[1].data = sywcData */
      option.series[1].data = weigData
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    searchList() {
      this.getCheckDormTableData()
    },
    handleTreeClick(params, selectNodetitle, tag) {
      if (tag === 0 || tag === 1 || tag === 2) {
        this.currentActiveTab = 1
      } else {
        this.currentActiveTab = 2
      }
      console.log(params)
      this.selectNodetitle = selectNodetitle
      this.searchForm = this.concatObj(this.searchForm, params)
      this.getCheckDormTableData()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.checkdorm-page {
  width: 100%;
  display: flex;
  .checkdorm-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 10px;
    width: calc(100% - 265px);
    .search_top {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .checkdorm_tab {
        span {
          cursor: pointer;
          padding-left: 5px;
          padding-right: 25px;
          font-size: 15px;
        }
        span.act {
          color: #6882da;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
