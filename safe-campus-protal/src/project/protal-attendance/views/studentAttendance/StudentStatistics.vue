<template>
  <div class="page-layout qui-fx">
    <major-tree v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'" @select="select"></major-tree>
    <grade-tree v-else @select="select"></grade-tree>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
        <!-- <template v-slot:other1="record">
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
        </template> -->
        <template v-slot:actions="action">
          <div>
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                style="margin-right: 5px; background: #909399; color:#fff"
                icon="ellipsis"
                @click="detail(action.record)"
              ></a-button>
            </a-tooltip>
          </div>
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
import columns from '../../assets/js/table/studentStatistics'

import hostEnv from '@config/host-env'
import MajorTree from '@c/MajorTree'
const searchLabel = [
  {
    value: 'searchKey', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '日期'
  }
]
export default {
  name: 'StudentStatistics',
  components: {
    GradeTree,
    SearchForm,
    TableList,
    PageNum,
    MajorTree
  },
  data() {
    return {
      searchLabel,
      searchList: {
        classCode: '',
        endDay: '',
        gradeCode: '',
        schoolCode: '',
        searchKey: '',
        startDay: ''
      },
      total: 0,
      columns,
      recordList: [],
      pageList: {
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    if (
      (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') &&
      this.columns[4].dataIndex !== 'gradeName'
    ) {
      this.columns[3] = {
        title: '年级',
        dataIndex: 'schoolYearId',
        width: '10%',
        customRender: text => {
          return text + '级'
        }
      }
      this.columns.splice(4, 0, {
        title: '专业',
        dataIndex: 'gradeName',
        width: '8%'
      })
    }
    this.searchList.schoolCode = this.userInfo.schoolCode
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getStudentStatistics', 'exportStuAtt']),
    exportClick() {
      const url = `${hostEnv.protal_api_11004}/student/static/list/export?schoolCode=${this.userInfo.schoolCode}&startDay=${this.searchList.startDay}&endDay=${this.searchList.endDay}&searchKey=${this.searchList.searchKey}&schoolYearId=${this.searchList.schoolYearId}&gradeCode=${this.searchList.gradeCode}&classCode=${this.searchList.classCode}`
      console.log(url)
      window.open(url)
      /* this.exportStuAtt({
        ...this.searchList,
        ...this.pageList,
        name: '学生考勤-考勤统计'
      }) */
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getStudentStatistics(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.schoolYearId =
        this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.gradeName : item.schoolYearId
      this.searchList.gradeCode =
        this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.subjectCode : item.gradeCode
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
    detail(record) {
      this.$router.push({
        path: '/studentStatistics/detail',
        query: {
          id: record.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
