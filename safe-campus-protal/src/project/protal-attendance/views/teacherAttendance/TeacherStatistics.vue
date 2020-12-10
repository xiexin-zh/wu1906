<template>
  <div class="page-layout qui-fx">
    <org-tree @select="select"></org-tree>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
        <template v-slot:other1="record">
          <a-tag @click="detail(1, record.record, '5')" color="#71d5a1">{{ record.record.normalCount }}</a-tag>
        </template>
        <template v-slot:other2="record">
          <a-tag @click="detail(1, record.record, '1')" color="#ff9900">{{ record.record.lateCount }}</a-tag>
        </template>
        <template v-slot:other3="record">
          <a-tag @click="detail(1, record.record, '2')" color="#ff9900">{{ record.record.earlyCount }}</a-tag>
        </template>
        <template v-slot:other4="record">
          <a-tag @click="detail(1, record.record, '7')" color="#fab6b6">{{ record.record.noRecord }}</a-tag>
        </template>
        <template v-slot:other5="record">
          <a-tag @click="detail(1, record.record, '3')" color="#fab6b6">{{ record.record.onNoRecordCount }}</a-tag>
        </template>
        <template v-slot:other6="record">
          <a-tag @click="detail(1, record.record, '4')" color="#ccc">{{ record.record.leaveCount }}</a-tag>
        </template>
        <template v-slot:totalNums="record">
          <a-tag @click="detail(1, record.record, '6')" color="#fab6b6">{{ record.record.offNoRecordCount }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <div>
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                style="margin-right: 5px; background: #909399; color:#fff"
                icon="ellipsis"
                @click="detail(0, action.record)"
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
import OrgTree from '@c/OrgTree'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import columns from '../../assets/js/table/teacherStatistics'
import hostEnv from '@config/host-env'
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
  name: 'TeacherStatistics',
  components: {
    OrgTree,
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      searchLabel,
      searchList: {
        endDay: '',
        orgCode: '',
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
      recordList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    this.searchList.schoolCode = this.userInfo.schoolCode
    // this.pageList.orgCode = this.userInfo.schoolCode
    this.searchList.orgCode = ''
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getTeacherStatistics', 'exportTeaAtt']),
    exportClick() {
      const url = `${hostEnv.protal_api_11004}/teacher/static/list/export?schoolCode=${this.userInfo.schoolCode}&startDay=${this.searchList.startDay}&endDay=${this.searchList.endDay}&searchKey=${this.searchList.searchKey}&orgCode=${this.searchList.orgCode}`
      console.log(url)
      window.open(url)
      /* this.exportTeaAtt({
        schoolCode: this.userInfo.schoolCode,
        searchKey: this.searchList.searchKey ? this.searchList.searchKey : undefined,
        startDay: this.searchList.startDay ? this.searchList.startDay : undefined,
        endDay: this.searchList.endDay ? this.searchList.endDay : undefined,
        orgCode: this.pageList.orgCode ? this.pageList.orgCode : this.userInfo.schoolCode,
        ...this.searchList,
        ...this.pageList,
        name: '教职工考勤-考勤统计'
      }) */
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getTeacherStatistics(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.pageList.orgCode = item.code
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
    detail(type, record, string) {
      const req = {
        id: record.id,
        userCode: record.code,
        startDay: this.searchList.startDay,
        endDay: this.searchList.endDay
      }
      if (type) {
        // req.count = record[string]
        req.count = string
      } else {
        req.count = '5'
      }
      this.$router.push({
        path: '/teacherStatistics/detail',
        query: req
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
