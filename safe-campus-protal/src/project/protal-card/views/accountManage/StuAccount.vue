<template>
  <div class="page-layout qui-fx">
    <a-modal title="批量导出数据" :visible="exportTag" @cancel="exportTag = false" @ok="exportFile">
      <p>请选择日期：<a-range-picker @change="onChange" /></p>
    </a-modal>
    <grade-tree @select="select"></grade-tree>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-all-btn" @click="exportTag = true">批量发卡</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
        <template v-slot:other1="record">
          <a-tag :color="$tools.color(record.record.onState)">{{ record.record.onState | onState }}</a-tag>
        </template>
        <template v-slot:other2="record">
          <a-tag :color="$tools.color(record.record.offState)">{{ record.record.offState | onState }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-tag color="#ccc" @click.stop="changeDetail(action.record)">详情</a-tag>
          <a-tag @click.stop="checkDetail(action.record)">充值</a-tag>
          <a-tag @click.stop="checkDetail(action.record)">发卡</a-tag>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GradeTree from '@c/GradeTree'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '8%',
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
    title: '学号',
    dataIndex: 'gradeName',
    width: '8%',
    customRender: (text, record) => {
      return `${record.gradeName}${record.className}`
    }
  },
  {
    title: '所属组织',
    dataIndex: 'dateTime',
    width: '12%'
  },
  {
    title: '状态',
    dataIndex: 'onState',
    width: '8%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '卡号',
    dataIndex: 'onTemperature',
    width: '8%'
  },
  {
    title: '卡类型',
    dataIndex: 'offTime',
    width: '8%'
  },
  {
    title: '账户余额',
    dataIndex: 'offState',
    width: '8%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '现金余额',
    dataIndex: 'offTemperature',
    width: '8%'
  },
  {
    title: '补助余额',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'searchKey', // 表单属性
    type: 'input', // 表单类型
    label: '卡号', // 表单label值
    placeholder: '请输入卡号' // 表单默认值(非必选字段)
  },
  {
    value: 'search', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '5',
        val: '正常'
      },
      {
        key: '1',
        val: '迟到'
      },
      {
        key: '3',
        val: '缺卡'
      },
      {
        key: '4',
        val: '请假'
      }
    ],
    value: 'onStatue',
    type: 'select',
    label: '状态'
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '5',
        val: '正常'
      },
      {
        key: '2',
        val: '早退'
      },
      {
        key: '6',
        val: '缺卡'
      },
      {
        key: '4',
        val: '请假'
      }
    ],
    value: 'offStatue',
    type: 'select',
    label: '卡类型'
  }
]
export default {
  name: 'StuAccount',
  components: {
    GradeTree,
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      searchLabel,
      searchList: {
        classCode: '',
        endDay: '',
        gradeCode: '',
        offStatue: '',
        onStatue: '',
        schoolCode: '',
        searchKey: '',
        startDay: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      recordList: [],
      exportTag: false,
      exportTime: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    // this.searchList.schoolCode = this.userInfo.schoolCode
    // this.showList()
  },
  methods: {
    ...mapActions('home', ['getStudentRecord']),
    onChange(date, dateString) {
      this.exportTime = dateString
    },
    exportFile() {
      if (!this.exportTime) {
        this.$message.warning('请选择导出日期')
        return
      }
      this.exportTag = false
      const time = new Date().getTime()
      const startDay = this.$tools.getDate(time - 1000 * 60 * 60 * 24 * 30).substr(0, 10)
      const endDay = this.$tools.getDate(time).substr(0, 10)
      const url = `${hostEnv.protal_api_11004}/teacher/static/record/list/download?schoolCode=${this.userInfo.schoolCode}&startDay=${this.exportTime[0]}&endDay=${this.exportTime[1]}`
      window.open(url)
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getStudentRecord(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.schoolYearId = item.schoolYearId
      this.searchList.gradeCode = item.gradeCode
      this.searchList.classCode = item.classCode
      this.showList()
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.startDay = values.rangeTime[0]
      this.searchList.endDay = values.rangeTime[1]
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    checkDetail(record) {
      this.$refs.recordDetail.recordId = record.id
      this.$refs.recordDetail.showList()
      this.$refs.recordDetail.dialogTag = true
    },
    changeDetail(record) {
      this.$refs.recordChange.recordId = record.id
      this.$refs.recordChange.dialogTag = true
    }
  }
}
</script>
<style lang="less" scoped></style>
