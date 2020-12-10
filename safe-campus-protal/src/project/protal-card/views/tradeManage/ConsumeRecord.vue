<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="退款"
      v-model="showTag"
      :form-data="formData">
    </submit-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columnList.consumeColumns" :table-list="consumeList">
        <template v-slot:actions="action">
          <a-tag color="#87d068" @click="refund(action.record)" v-if="action.record.refundedType === 1">退款</a-tag>
          <a-tag color="#6882DA" v-if="action.record.refundedType === 2">已退款</a-tag>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '../../component/SubmitForm'
import columnList from '../../assets/table/consumeColumns'
const searchLabel = [
  {
    value: 'card',
    type: 'input',
    label: '卡号',
    placeholder: '请输入卡号'
  },
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
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
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '消费日期'
  }
]
const formData = [
  {
    value: 'oddNumbers',
    initValue: '',
    type: 'input',
    label: '交易号',
    disabled: true,
    required: false
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '姓名',
    disabled: true,
    required: false
  },
  {
    value: 'orgName',
    initValue: '',
    type: 'input',
    label: '班级/部门',
    disabled: true,
    required: false
  },
  {
    value: 'userType',
    initValue: '',
    type: 'input',
    label: '身份',
    disabled: true,
    required: false
  },
  {
    value: 'workNo',
    initValue: '',
    type: 'input',
    label: '学号/工号',
    disabled: true,
    required: false
  },
  {
    value: 'card',
    initValue: '',
    type: 'input',
    label: '卡号',
    disabled: true,
    required: false
  },
  {
    value: 'orderAmount',
    initValue: '',
    type: 'input',
    label: '订单金额',
    disabled: true,
    required: false
  },
  {
    value: 'discountAmount',
    initValue: '',
    type: 'input',
    label: '优惠金额',
    disabled: true,
    required: false
  },
  {
    value: 'actualAmount',
    initValue: '',
    type: 'input',
    label: '实付金额',
    disabled: true,
    required: false
  },
  {
    value: 'deviceName',
    initValue: '',
    type: 'input',
    label: '实付金额',
    disabled: true,
    required: false
  },
  {
    value: 'createTime',
    initValue: '',
    type: 'input',
    label: '消费时间',
    disabled: true,
    required: false
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
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
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getConsumeDetail', 'userRefund']),
    exportClick() {
      var url = `${hostEnv.hpb_card}/consume/record/exportConsumeDetailList`
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          var content = this.response
          var aTag = document.createElement('a')
          var blob = new Blob([content])
          var headerName = xhr.getResponseHeader('Content-disposition')
          var fileName = decodeURIComponent(headerName).substring(20)
          aTag.download = fileName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(blob)
        }
      }
      xhr.send(JSON.stringify(this.searchList))
    },
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        createTime: this.rangeTime[0] || undefined,
        endTime: this.rangeTime[1] || undefined
      }
      this.searchList = req
      const res = await this.getConsumeDetail(req)
      this.consumeList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchObj = values
      this.rangeTime = values.rangeTime
      this.showList()
    },
    refund(record) {
      this.showTag = true
      record.createTime = this.$tools.getDate(record.createTime)
      record.userType = this.$tools.userType(record.userType)
      this.userId = record.userId
      this.userCode = record.userCode
      this.formData = this.$tools.fillForm(formData, record)
    },
    async submitForm (values) {
      console.log(values)
      const req = {
        userCode: this.userCode,
        userId: this.userId,
        card: values.card,
        consumeBalance: values.actualAmount,
        oddNumbers: values.oddNumbers,
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
