<template>
  <div class="page-layout qui-fx-ver">
    <div class="top-btn-group">
      <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
    </div>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看详情">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="detail(action.record.id)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
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
    title: '账单状态',
    dataIndex: 'billStatus',
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
    width: '8%'
  },
  {
    title: '截止时间',
    dataIndex: 'cutOffTime',
    width: '8%'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ChargeWarning',
  components: {
    TableList,
    PageNum
  },
  data() {
    return {
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['downoverdueBillInfo', 'getoverdueBillInfo']),
    async showList(searchObj = {}) {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getoverdueBillInfo(req)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    async detail(id) {
      const res = await this.getcollectionDetail(id)
      this.detailList = res.data
    },
    exportClick() {
      const url = `${hostEnv.protal_api_10097}/overdueBillInfo/getOverdueBillExcel/${this.userInfo.schoolCode}`
      window.open(url)
    }
  }
}
</script>
<style lang="less" scoped></style>
