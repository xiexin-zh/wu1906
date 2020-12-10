<template>
  <div class="page-layout qui-fx-ver">
    <div class="qui-fx-f1 qui-fx">
      <div class="grade-tree">
        <grade-tree @select="select"></grade-tree>
      </div>
      <div class="qui-fx-f1 qui-fx-ver">
        <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
        <table-list
          :page-list="pageList"
          :columns="columns"
          :table-list="recordList">
          <template v-slot:other1="record">
            <a-tag :color="$tools.color(record.record.onState)" >{{ record.record.onState | onState }}</a-tag>
          </template>
          <template v-slot:other2="record">
            <a-tag :color="$tools.color(record.record.offState)" >{{ record.record.offState | onState }}</a-tag>
          </template>
        </table-list>
        <page-num
          v-model="pageList"
          :total="total"
          @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GradeTree from '@c/GradeTree'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import SearchForm from '@c/SearchForm'
const searchLabel = [
  {
    value: 'searchKey', // 分类查询
    type: 'selectInput', // 表单类型
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '学号'
      }
    ],
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '日期'
  },
  {
    list: [
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
    label: '上学状态'
  },
  {
    list: [
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
    label: '放学状态'
  }
]
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
    title: '年级',
    dataIndex: 'gradeName',
    width: '8%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '8%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '日期',
    dataIndex: 'dateTime',
    width: '8%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '上学时间',
    dataIndex: 'onTime',
    width: '8%',
    customRender: text => {
      return $tools.getDate(text, 2)
    }
  },
  {
    title: '上学体温',
    dataIndex: 'onTemperature',
    width: '8%'
  },
  {
    title: '上学状态',
    dataIndex: 'onState',
    width: '8%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '放学时间',
    dataIndex: 'offTime',
    width: '8%',
    customRender: text => {
      return $tools.getDate(text, 2)
    }
  },
  {
    title: '放学体温',
    dataIndex: 'offTemperature',
    width: '8%'
  },
  {
    title: '放学状态',
    dataIndex: 'offState',
    width: '8%',
    scopedSlots: {
      customRender: 'other2'
    }
  }
]
export default {
  name: 'AttendanceRecord',
  components: {
    TableList,
    PageNum,
    SearchForm,
    GradeTree
  },
  data () {
    return {
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
      searchLabel
    }
  },
  computed: {
    ...mapState('home', [ 'userInfo' ])
  },
  mounted () {
    this.searchList.schoolCode = this.userInfo.schoolCode
  },
  methods: {
    ...mapActions('home', ['getStudentRecord']),
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.startDay = values.rangeTime[0]
      this.searchList.endDay = values.rangeTime[1]
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    async showList () {
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
    }
  }
}
</script>
<style lang="less" scoped>
.grade-tree {
  padding: 0 10px;
  width: 200px;
  min-height: 400px;
  max-height: 800px;
  overflow-y: auto
}
</style>
