<template>
  <div class="page-layout qui-fx-ver">
    <div style="height:130px;background:#fff;">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基本信息" key="1">
          <a-row class="padd-l10">
            <a-col v-for="(item,index) in baseList" :key="index" :span="12" class="mar-b10">
              {{ item.key }} : {{ item.value }}
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <a-tabs :defaultActiveKey="attendanceState" @change="callback" style="height:50px;">
        <a-tab-pane tab="正常次数" key="5"></a-tab-pane>
        <a-tab-pane tab="迟到次数" key="1"></a-tab-pane>
        <a-tab-pane tab="早退次数" key="2"></a-tab-pane>
        <a-tab-pane tab="上班缺卡次数" key="3"></a-tab-pane>
        <a-tab-pane tab="下班缺卡次数" key="6"></a-tab-pane>
        <a-tab-pane tab="请假次数" key="4"></a-tab-pane>
        <a-tab-pane tab="缺勤次数" key="7"></a-tab-pane>
      </a-tabs>
      <table-list
        is-zoom
        :page-list="pageList"
        :columns="current === '4' ? leaveColumns : current === '7' ? absenceColumns : columns"
        :table-list="detailList"
        :rowKey="(record,index) => index">
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '日期',
    dataIndex: 'dayTime',
    width: '20%',
    customRender: text => {
      return text ? $tools.getDate(text, 1) : ''
    }
  },
  {
    title: '班次',
    dataIndex: 'shift',
    width: '20%',
    customRender: text => {
      return text ? $tools.classState(text) : ''
    }
  },
  {
    title: '打卡时间',
    dataIndex: 'realTime',
    width: '25%',
    customRender: text => {
      return text ? $tools.getDate(text, 5) : ''
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snacpUrl',
    width: '25%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
const leaveColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '日期',
    dataIndex: 'dayTime',
    width: '20%',
    customRender: text => {
      return text ? $tools.getDate(text, 1) : ''
    }
  },
  {
    title: '请假时间',
    dataIndex: 'leaveTime',
    width: '35%',
    customRender: text => {
      return text ? $tools.getDate(text, 5) : ''
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snacpUrl',
    width: '35%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
const absenceColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '日期',
    dataIndex: 'dayTime',
    width: '20%',
    customRender: text => {
      return text ? $tools.getDate(text, 1) : ''
    }
  },
  {
    title: '打卡时间',
    dataIndex: 'realTime',
    width: '35%',
    customRender: text => {
      return text ? $tools.getDate(text, 5) : ''
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snacpUrl',
    width: '35%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
export default {
  name: 'StatisticsDetail',
  components: {
    TableList,
    PageNum
  },
  data () {
    return {
      baseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      leaveColumns,
      absenceColumns,
      detailList: [],
      detailId: '',
      attendanceState: '5',
      current: '5'
    }
  },
  created() {
    console.log(this.$route.query.count)
    this.attendanceState = this.$route.query.count
  },
  async mounted () {
    this.detailId = this.$route.query.id
    this.showList()
  },
  methods: {
    ...mapActions('home', ['teacherDetailStatistics']),
    async showList () {
      this.pageList.userCode = this.$route.query.userCode
      this.pageList.userId = this.detailId
      this.pageList.attendanceState = this.attendanceState
      this.pageList.startDay = this.$route.query.startDay
      this.pageList.endDay = this.$route.query.endDay
      const res = await this.teacherDetailStatistics(this.pageList)
      this.detailList = res.data.pageInfo.list
      this.total = res.data.pageInfo.total
      this.baseList = [
        {
          key: '姓名',
          value: res.data.userName
        },
        {
          key: '工号',
          value: res.data.workNo
        },
        {
          key: '组织机构',
          value: res.data.orgName
        },
        {
          key: '日期',
          value: `${res.data.startDay ? res.data.startDay : ''}~${res.data.startDay ? res.data.endDay : ''}`
        }
      ]
    },
    callback (key) {
      this.current = key
      setTimeout(() => {
        this.pageList.size = 20
        this.pageList.page = 1
        this.attendanceState = key
        this.showList()
      }, 300)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
