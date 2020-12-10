<template>
  <div class="page-layout qui-fx">
    <div class="page-left">
      <grade-tree @select="select"></grade-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-btn" @click="handleTplDownload">导出</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="查看详情">
            <a-button
              size="small"
              class="detail-action-btn"
              icon="ellipsis"
              @click.stop="goDetail('/components/BillDetail', action.record)"
            ></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import GradeTree from '@c/GradeTree'
import Tools from '@u/tools'
const columns = [
  {
    title: '账单号',
    dataIndex: 'billNum',
    width: '8%'
  },
  {
    title: '账单名称',
    dataIndex: 'billName',
    width: '8%'
  },
  {
    title: '学生姓名',
    dataIndex: 'studentName',
    width: '8%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '8%'
  },
  {
    title: '学年',
    dataIndex: 'schoolYearName',
    width: '8%'
  },
  {
    title: '账单金额',
    dataIndex: 'billMoney',
    width: '8%'
  },
  {
    title: '优惠金额',
    dataIndex: 'preMoney',
    width: '8%'
  },
  {
    title: '应收金额',
    dataIndex: 'recMoney',
    width: '8%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '8%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '截止时间',
    dataIndex: 'cutOffTime',
    width: '8%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '账单状态',
    dataIndex: 'billStatus',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '待缴费'
      } else if (text === '2') {
        return '已缴费'
      } else if (text === '3') {
        return '账单关闭'
      } else if (text === '4') {
        return '逾时'
      }
    }
  },
  {
    title: '操作',
    width: '8%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'billName',
    type: 'input',
    label: '账单名称',
    placeholder: '请输入账单名称'
  },
  {
    value: 'userName',
    type: 'input',
    label: '学生姓名',
    placeholder: '请输入学生姓名'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '创建时间'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '已缴费'
      },
      {
        key: '1',
        val: '待缴费'
      },
      {
        key: '2',
        val: '逾时'
      },
      {
        key: '3',
        val: '账单关闭'
      }
    ],
    value: 'billStatus',
    type: 'select',
    label: '账单状态'
  }
]
export default {
  name: 'BillList',
  components: {
    TableList,
    SearchForm,
    PageNum,
    GradeTree
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        schoolCode: ''
      },
      previewVisible: false,
      detailList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['getbillInfo', 'downBillExcelData']),
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getbillInfo(this.searchList)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.billName = values.billName
      this.userName = values.userName
      this.billStatus = values.billStatus
      this.startTime = values.rangeTime ? values.rangeTime[0] : ''
      this.endTime = values.rangeTime ? values.rangeTime[1] : ''
      const searchObj = {
        billName: this.billName,
        userName: this.userName,
        billStatus: this.billStatus,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.showList(searchObj)
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.gradeCode = item.gradeCode
      this.searchList.classCode = item.classCode
      this.searchList.schoolYearId = item.schoolYearId
      this.showList()
    },
    async handleTplDownload() {
      await this.downBillExcelData({
        name: '账单列表',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    // 详情
    goDetail(path, record) {
      this.$router.push({
        path,
        query: {
          id: record.id,
          taskCode: record.taskCode,
          billNum: record.billNum
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
