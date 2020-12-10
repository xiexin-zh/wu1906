<template>
  <div class="checkdorm-page" v-cloak>
    <a-modal :title="dialogTitle" v-model="knowDetailTag" :footer="null" width="1100px">
      <a-table
        :rowKey="(record, index) => index"
        :pagination="false"
        :columns="konwDetail"
        :dataSource="konwTableDetail"
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
      <a-row type="flex" justify="space-between" align="middle" class="search-form">
        <a-col>
          <div class="checkdorm_tab">
            <span
              @click="changeTab(item, index)"
              :class="{ act: tabIndex == index }"
              v-for="(item, index) in tabMenuList"
              :key="index"
            >{{ item.taskName }}</span
            >
          </div>
        </a-col>
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
          :dataSource="knowTableData"
          :scroll="{ y: tableHeight1 }"
        >
          <template slot="number" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template>
            <span slot="customTitle">{{ this.currentActiveTab === 1 ? '宿舍名称' : '年级/班级名称' }}</span>
          </template>
          <template slot="realNum" slot-scope="realNum, record">
            <a-tag @click="checkInfo('0,2', realNum, record.wdate, '在寝', record.dormName)" color="#108ee9">{{
              realNum
            }}</a-tag>
          </template>
          <template slot="excNum" slot-scope="excNum, record">
            <a-tag @click="checkInfo(3, excNum, record.wdate, '不在寝', record.dormName)" color="#f50">{{
              excNum
            }}</a-tag>
          </template>
          <template slot="leaveNum" slot-scope="leaveNum, record">
            <a-tag @click="checkInfo(1, leaveNum, record.wdate, '请假', record.dormName)" color="#ccc">{{
              leaveNum
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
    key: 'index',
    width: '10%',
    scopedSlots: {
      customRender: 'number'
    },
    align: 'center'
  },
  {
    title: '日期',
    dataIndex: 'wdate',
    key: 'wdate',
    width: '20%',
    align: 'center'
  },
  {
    slots: { title: 'customTitle' },
    dataIndex: 'dormName',
    key: 'dormName',
    width: '20%',
    align: 'center'
  },
  {
    title: '在寝人数',
    dataIndex: 'realNum',
    key: 'realNum',
    width: '15%',
    scopedSlots: {
      customRender: 'realNum'
    },
    align: 'center'
  },
  {
    title: '不在寝人数',
    key: 'excNum',
    dataIndex: 'excNum',
    width: '15%',
    scopedSlots: {
      customRender: 'excNum'
    },
    align: 'center'
  },
  {
    title: '请假人数',
    key: 'leaveNum',
    dataIndex: 'leaveNum',
    width: '15%',
    scopedSlots: {
      customRender: 'leaveNum'
    },
    align: 'center'
  }
]

export default {
  name: 'CheckTotal',
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
        checkType: 1, // 中午查寝 1，晚间查寝 2
        classCode: null, // 班级
        endDate: '',
        floorCode: null, // 楼层
        gradeCode: null, // 年级
        roomCode: null, // 房间
        schoolCode: sessionStorage.getItem('schoolScheme'), // 学校code
        stageCode: null, // 学阶
        startDate: ''
      },
      tabMenuList: [],
      tabIndex: 0,
      searchTime: null,
      selectNodetitle: '',
      knowTableData: [],
      konwTableDetail: [],
      konwDetail: konwTable(),
      currentActiveTab: 0
    }
  },
  methods: {
    ...mapActions('checkTotal', ['getTaskInfoList', 'getCheckStatisticsList', 'getCheckStatisticsDetail']),
    checkInfo(type, num, date, title, dormName) {
      if (num === 0) return
      if (type === 1 || type === 3) {
        this.konwDetail = konwTable(2)
      } else {
        this.konwDetail = konwTable()
      }
      this.getCheckStatisticsDetail({
        buildingCode: this.searchForm.buildingCode, // 楼栋编码
        checkType: this.searchForm.checkType, // 查寝类型 1：午查寝 2：晚查寝 必填
        classCode: this.searchForm.classCode, // 班级编码
        checkStatus: type, // 数据类型 0：正常数据 1：异常数据 2：请假数据 必填
        floorCode: this.searchForm.floorCode, // 楼层编码
        gradeCode: this.searchForm.gradeCode, // 年级编码
        roomCode: this.searchForm.roomCode, // 房间编码
        schoolCode: this.searchForm.schoolCode, // 学校编码 必填
        stageCode: this.searchForm.stageCode, // 学阶编码
        wdate: date, // 哪一天的详情数据 必填
        schoolYearId: this.searchForm.schoolYearId ? this.searchForm.schoolYearId : ''
      }).then(res => {
        this.konwTableDetail = res.data
        this.dialogTitle = this.currentTabItem.taskName + '-' + dormName + '-' + title + num + '人' + '(' + date + ')'
        this.knowDetailTag = true
      })
    },
    getDormType() {
      this.getTaskInfoList({ schoolCode: sessionStorage.getItem('schoolScheme') })
        .then(res => {
          if (res.data.length === 0) {
            return
          }
          this.tabMenuList = res.data
          this.currentTabItem = this.tabMenuList[this.tabIndex]
          this.getCheckDormTableData()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getCheckDormTableData() {
      const req = this.searchForm
      this.searchForm.checkType = this.currentTabItem.taskType
      if (this.searchTime == null || this.searchTime.length === 0) {
        this.searchForm.startDate = this.getCurrentTimeAndOneMonth(0)
        this.searchForm.endDate = this.getCurrentTimeAndOneMonth(1)
      } else {
        this.searchForm.startDate = this.searchTime[0]
        this.searchForm.endDate = this.searchTime[1]
      }
      this.getCheckStatisticsList(req).then(res => {
        this.knowTableData = res.data
        this.knowTableData.forEach((item, index) => {
          this.$set(item, 'index', index)
          this.$set(item, 'dormName', this.selectNodetitle)
          item.wdate = this.getdate(item.wdate).split(' ')[0]
        })
        const chartData = res.data.concat()
        this.setChart(chartData.reverse())
      })
    },
    setChart(data) {
      var timeList = []
      var zcdkData = []
      var ycdkData = []
      var qjData = []
      for (var i = 0, l = data.length; i < l; i++) {
        timeList.push(this.getdate(data[i].wdate).substring(0, 10))
        zcdkData.push(data[i].realNum)
        ycdkData.push(data[i].excNum)
        qjData.push(data[i].leaveNum)
      }
      var myChart = echarts.init(document.getElementById('main_line'))
      var colors = ['#5793f3', '#d14a61', '#cccccc']
      // 指定图表的配置项和数据
      var option = {
        color: colors,
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['在寝', '不在寝', '请假']
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
            name: '在寝',
            type: 'line',
            smooth: true,
            data: []
          },
          {
            name: '不在寝',
            type: 'line',
            smooth: true,
            data: []
          },
          {
            name: '请假',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      }
      option.xAxis[0].data = timeList
      option.xAxis[1].data = timeList
      option.xAxis[2].data = timeList
      option.series[0].data = zcdkData
      option.series[1].data = ycdkData
      option.series[2].data = qjData
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    searchList() {
      this.getCheckDormTableData()
    },
    changeTab(item, index) {
      this.tabIndex = index
      this.searchForm.checkType = item.taskType
      this.currentTabItem = item
      this.getCheckDormTableData()
    },
    handleTreeClick(params, selectNodetitle, tag) {
      if (tag === 0 || tag === 1 || tag === 2) {
        this.currentActiveTab = 1
      } else {
        this.currentActiveTab = 2
      }
      this.selectNodetitle = selectNodetitle
      this.searchForm = this.concatObj(this.searchForm, params)
      this.getDormType()
    }
  },
  mounted() {
  }
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
</style>
