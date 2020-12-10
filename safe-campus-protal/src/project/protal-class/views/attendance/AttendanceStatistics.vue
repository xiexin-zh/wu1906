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
            <a-tag color="#71d5a1">{{ record.record.normalCount }}</a-tag>
          </template>
          <template v-slot:other2="record">
            <a-tag color="#ff9900">{{ record.record.lateCount }}</a-tag>
          </template>
          <template v-slot:other3="record">
            <a-tag color="#fa3534">{{ record.record.earlyCount }}</a-tag>
          </template>
          <template v-slot:other4="record">
            <a-tag color="#fab6b6">{{ record.record.noRecord }}</a-tag>
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
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '日期'
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
    title: '学号',
    dataIndex: 'workNo',
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
    title: '正常',
    dataIndex: 'normalCount',
    width: '8%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '迟到',
    dataIndex: 'lateCount',
    width: '8%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '早退',
    dataIndex: 'earlyCount',
    width: '8%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '上学缺卡',
    dataIndex: 'onNoRecordCount',
    width: '8%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '放学缺卡',
    dataIndex: 'offNoRecordCount',
    width: '8%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '请假',
    dataIndex: 'leaveCount',
    width: '8%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '缺勤',
    dataIndex: 'noRecord',
    width: '8%',
    scopedSlots: {
      customRender: 'other4'
    }
  }
]
export default {
  name: 'AttendanceStatistics',
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
    ...mapActions('home', ['getStudentStatistics']),
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
      const res = await this.getStudentStatistics(this.searchList)
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
