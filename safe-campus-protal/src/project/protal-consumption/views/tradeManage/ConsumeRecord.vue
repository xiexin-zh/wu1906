<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <submit-form ref="form" @submit-form="submitForm" title="退款" v-model="showTag" :form-data="formData">
    </submit-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columnList.consumeColumns" :table-list="consumeList">
        <template v-slot:actions="action">
          <a-tag color="#87d068" @click="refund(action.record)" v-if="action.record.consumeStatus === '2'">退款</a-tag>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '../../component/SubmitForm'
import columnList from '../../assets/table/consumeColumns'
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    list: [],
    value: 'consumeStatus',
    type: 'select',
    label: '状态'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'deviceName',
    type: 'select',
    label: '设备'
  }
]
const formData = [
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '退款原因',
    placeholder: '请输入退款原因'
  },
  {
    type: 'text',
    label: ' ',
    text: '* 退款金额将原路返回',
    style: {
      color: 'red'
    }
  }
]
export default {
  name: 'ConsumeRecord',
  components: {
    SearchForm,
    TableList,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      total: 0,
      searchLabel,
      formData,
      showTag: false,
      columnList,
      pageList: {
        page: 1,
        size: 20
      },
      rangeTime: [],
      searchObj: {},
      consumeList: [],
      userId: '',
      userCode: '',
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getDictList()
    this._getMachineList()
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getMachineList', 'getConsumeList', 'userRefund', 'exportConsumeList', 'getDictList']),
    async _getDictList() {
      this.searchLabel[2].list = []
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: 'consume_status'
      })
      res.rows.forEach((ele) => {
        this.searchLabel[2].list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      const index = this.columnList.consumeColumns.findIndex(list => list.dataIndex === 'consumeStatus')
      this.columnList.consumeColumns[index].customRender = (text) => {
        return res.rows.filter(ele => ele.dictValue === text).length > 0 ? res.rows.filter(ele => ele.dictValue === text)[0].dictLabel : ''
      }
    },
    async exportClick() {
      await this.exportConsumeList({
        name: '消费记录',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    async _getMachineList() {
      this.searchLabel[3].list = []
      const res = await this.getMachineList({
        pageNum: 1,
        pageSize: 9999,
        isOpen: '1'
      })
      res.rows.forEach((ele) => {
        this.searchLabel[3].list.push({
          key: ele.sn,
          val: ele.deviceName
        })
      })
    },
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        userName: this.searchObj.userName,
        consumeStatus: this.searchObj.consumeStatus,
        sn: this.searchObj.deviceName,
        beginTime: this.rangeTime[0] || '',
        endTime: this.rangeTime[1] || ''
      }
      this.searchList = req
      const res = await this.getConsumeList(req)
      this.consumeList = res.rows
      this.total = res.total
    },
    searchForm(values) {
      this.searchObj = values
      this.rangeTime = values.rangeTime
      this.showList()
    },
    refund(record) {
      this.showTag = true
      this.refundRecord = record
    },
    async submitForm(values) {
      console.log(values)
      const req = {
        id: this.refundRecord.id,
        remark: values.remark
      }
      await this.userRefund(req)
      this.$message.success('退款成功')
      this.$tools.goNext(() => {
        this.showList()
        this.$refs.form.reset()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
