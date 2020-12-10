<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="add">添加</a-button>
      </div>
    </search-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看详情">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="goDetail('/components/ChargeDetail', action.record)"
          ></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
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
    title: '任务名称',
    dataIndex: 'taskName',
    width: '10%'
  },
  {
    title: '账单数',
    dataIndex: 'billSum',
    width: '10%'
  },
  {
    title: '已完成账单',
    dataIndex: 'paidSum',
    width: '10%'
  },
  {
    title: '未缴费账单',
    dataIndex: 'unpaidSum',
    width: '10%'
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '截止时间',
    dataIndex: 'cutOffTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'taskName',
    type: 'input',
    label: '任务名称',
    placeholder: '请输入任务名称'
  }
]
export default {
  name: 'ChargingTask',
  components: {
    TableList,
    SearchForm,
    PageNum
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
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getchargeTaskList', 'getchargeTaskInfo']),
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getchargeTaskList(this.searchList)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.taskName = values.taskName
      this.state = values.state
      const searchObj = {
        taskName: this.taskName
      }
      this.showList(searchObj)
    },
    add() {
      this.$router.push({
        path: '/components/AddTask'
      })
    },
    // 详情
    goDetail(path, record) {
      this.$router.push({
        path,
        query: {
          id: record.id,
          taskCode: record.taskCode
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
