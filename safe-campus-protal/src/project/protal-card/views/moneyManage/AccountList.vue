<template>
  <div class="account-list page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="actionTitle"
      v-model="showTag"
      :form-data="formData">
    </submit-form>
    <count-detail
      ref="countDetail"
      isSearch
      v-if="showDetailTag"
      v-model="showDetailTag"
      :columns="columnList.dealColumn"
      :searchLabel="dealSearchLabel"
      chooseType="6"
      :userId="userId"
      title="交易记录">
    </count-detail>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list is-zoom :page-list="pageList" :columns="accountColumns" :table-list="accountList">
        <template v-slot:other1="other1">
          <a-tag color="orange" @click="showDetail(other1.record)">{{ other1.record.userName }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-tag color="#87d068" @click="handle('充值', action.record)" v-if="action.record.status === 0">充值</a-tag>
          <a-tag color="#f50" @click="handle('扣款', action.record)" v-if="action.record.status === 0">扣款</a-tag>
          <a-tag color="#2db7f5" @click="handle('补助', action.record)" v-if="action.record.status === 0">补助</a-tag>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import SubmitForm from '../../component/SubmitForm'
import TableList from '@c/TableList'
import CountDetail from '../../component/CountDetail'
import PageNum from '@c/PageNum'
import AccountOperation from './AccountOperation'
import baseData from '../../assets/js/base'
import tools from '@u/tools'
import accountColumns from '../../assets/table/accountColumns'
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
      },
      {
        key: 8,
        val: '学生'
      },
      {
        key: 4,
        val: '教职工'
      }
    ],
    value: 'userIdentity',
    type: 'select',
    label: '身份'
  },
  {
    list: tools.deepClone(baseData.cardStatus),
    value: 'status',
    type: 'select',
    label: '状态'
  },
  {
    list: [{
      key: '',
      val: '全部'
    }],
    value: 'cardType',
    type: 'select',
    label: '类型'
  }
]
const dealSearchLabel = [
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '交易时间'
  },
  {
    list: tools.deepClone(baseData.daelType),
    value: 'status',
    type: 'select',
    label: '交易类型'
  }
]
const formData = [
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
    value: 'userIdentity',
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
    value: 'status',
    initValue: '',
    type: 'input',
    label: '状态',
    disabled: true,
    required: false
  },
  {
    value: 'cardName',
    initValue: '',
    type: 'input',
    label: '卡类型',
    disabled: true,
    required: false
  },
  {
    value: 'balance',
    initValue: '',
    type: 'input',
    label: '账户余额',
    disabled: true,
    required: false
  },
  {
    value: 'consumeBalance',
    initValue: '',
    type: 'input',
    label: '充值金额',
    placeholder: '请输入充值金额'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注'
  },
  {
    type: 'text',
    label: '',
    text: '* 请确认核对收到一致的现金金额',
    style: {
      color: 'red'
    }
  }
]
export default {
  name: 'AccountList',
  components: {
    SearchForm,
    TableList,
    PageNum,
    AccountOperation,
    CountDetail,
    SubmitForm
  },
  data() {
    return {
      title: '绑卡',
      confirmLoading: false,
      visible: false,
      showDetailTag: false,
      showTag: false,
      total: 0,
      actionTitle: '',
      searchLabel,
      dealSearchLabel,
      accountColumns,
      columnList,
      formData,
      pageList: {
        page: 1,
        size: 20
      },
      accountList: [],
      userId: '',
      rangeTime: [],
      searchObj: {},
      type: '',
      id: '',
      cardList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getCardList()
  },
  methods: {
    ...mapActions('home', ['getCardType', 'getUserInfoList', 'recharge', 'charge', 'subsidy']),
    async getCardList() {
      const res = await this.getCardType()
      this.cardList = res.data
      res.data.forEach(ele => {
        this.searchLabel[4].list.push({
          key: ele.cardType,
          val: ele.cardName
        })
      })
      this.$nextTick(() => {
        this.showList()
      })
    },
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchObj
      }
      const res = await this.getUserInfoList(req)
      this.accountList = res.data.list.map(el => {
        return {
          ...el,
          id: el.userId
        }
      })
      this.accountList.map(ele => {
        const index = this.cardList.findIndex(list => {
          return list.id === ele.cardType
        })
        if (index !== -1) {
          ele.cardType = this.cardList[index].cardName
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = values
      this.showList()
    },
    showDetail(record) {
      this.userId = record.userId
      this.showDetailTag = true
    },
    handle(title, record) {
      this.actionTitle = title
      this.id = record.userId
      this.formData = this.$tools.fillForm(formData, {
        ...record,
        userIdentity: this.$tools.userType(record.userIdentity),
        status: this.$tools.getCardStatus(record.status)
      })
      if (title === '充值') {
        this.type = '0'
        this.formData.splice(-2, 1)
      } else if (title === '扣款') {
        this.type = '1'
        this.formData[8].label = '扣款金额'
        this.formData[8].placeholder = '请输入扣款金额'
        this.formData[10].text = '* 请确认核对扣款金额'
      } else if (title === '补助') {
        this.type = '2'
        this.formData[8].label = '补助金额'
        this.formData[8].placeholder = '请输入补助金额'
        this.formData[10].text = '* 补助金额将直接发放到用户账户中，请核实操作'
      }
      this.showTag = true
    },
    async submitForm (values) {
      console.log('values', values)
      // return false
      const req = {
        ...values,
        userCode: this.userInfo.userCode,
        userId: this.id,
        card: values.card,
        consumeBalance: values.consumeBalance,
        remark: values.remark,
        balance: values.balance
      }
      if (this.type === '0') {
        await this.recharge(req)
        this.$message.success('充值成功')
      } else if (this.type === '1') {
        await this.charge(req)
        this.$message.success('扣款成功')
      } else if (this.type === '2') {
        await this.subsidy(req)
        this.$message.success('补助成功')
      }
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
