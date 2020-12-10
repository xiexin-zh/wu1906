<template>
  <div class="charge-detail page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <div slot="tabBarExtraContent" class="detail-show">
      <div class="qui-fx-jsb top-title mar-b10 mar-t10">
        <div class="title">基础信息</div>
        <div class="mar-top">
          <a-button icon="plus" class="add-btn mar-l10" @click="changeTime">延期</a-button>
          <a-button icon="export" class="export-btn" @click="handleTplDownload">下载对账单</a-button>
        </div>
      </div>
      <a-row>
        <a-col class="detail-row" :span="8"
          >任务名称： <span>{{ this.detailList.taskName }}</span></a-col
        >
        <a-col class="detail-row" :span="8">
          创建时间：<span>{{ this.detailList.createTime }}</span></a-col
        >
        <a-col class="detail-row" :span="8">
          截止时间： <span>{{ this.detailList.cutOffTime }}</span></a-col
        >
        <a-col class="detail-row" :span="2">缴费进度: </a-col>
        <a-col class="detail-row" :span="16"
          ><a-progress
            :percent="Number(GetPercent(this.detailList.paidSum, this.detailList.billSum))"
            strokeColor="#9698d6"
          />
        </a-col>
        <a-col class="detail-row" :span="6"
          ><span class="u-type-primary">已缴费￥{{ this.detailList.paidMoneySum }}</span
          ><span class="u-type-error">未缴费￥{{ this.detailList.unpaidMoneySum }}</span></a-col
        >
      </a-row>
    </div>
    <div slot="tabBarExtraContent" class=" detail-show">
      <div class="qui-fx-jsb top-title mar-b10 mar-t10">
        <div class="title">账单信息</div>
        <div class="mar-top">
          <a-button icon="plus" class="add-btn mar-l10" @click="modify()">新增账单</a-button>
          <a-button icon="export" class="export-all-btn" @click.stop="deleteList(0)">批量催缴</a-button>
          <a-button icon="delete" class="del-btn" @click.stop="deleteList(1)">批量关闭</a-button>
        </div>
      </div>
    </div>
    <search-form isReset @search-form="searchForm" :search-label="searchLabel"> </search-form>
    <div class="content qui-fx-ver qui-fx-f1">
      <div class="table qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="recordList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
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
    <sub-form
      ref="subForm"
      :title="title"
      :popTaskCode="popTaskCode"
      :popTaskId="popTaskId"
      @update="showList"
    ></sub-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import Tools from '@u/tools'
import SubForm from '../components/SubForm'
const formData = [
  {
    value: 'delayTime',
    type: 'singleTime',
    label: '延期时间'
  }
]
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
  // {
  //   value: 'userName',
  //   type: 'input',
  //   label: '班级名称',
  //   placeholder: '请输入班级名称'
  // },
  {
    value: 'userName',
    type: 'input',
    label: '学生姓名',
    placeholder: '请输入学生姓名'
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
  name: 'ChargeDetail',
  components: {
    TableList,
    SearchForm,
    PageNum,
    SubmitForm,
    SubForm
  },
  data() {
    return {
      searchLabel,
      columns,
      total: 100,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      id: '',
      detailList: {},
      percent: '',
      recordList: [],
      searchList: {
        schoolCode: '',
        taskCode: ''
      },
      formData,
      formStatus: false,
      title: '延期',
      popTaskCode: this.$route.query.taskCode,
      popTaskId: this.$route.query.id
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.init()
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getchargeTaskInfo',
      'getbillInfo',
      'delayTaskTime',
      'callBill',
      'shutDownBill',
      'downBillExcelData'
    ]),
    async init() {
      const res = await this.getchargeTaskInfo(this.id)
      this.detailList = res.data
    },
    GetPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0' : Math.round((num / total) * 10000) / 100.0
    },
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList.taskCode = this.$route.query.taskCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getbillInfo(this.searchList)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.userName = values.userName
      this.billStatus = values.billStatus
      const searchObj = {
        userName: this.userName,
        billStatus: this.billStatus
      }
      this.showList(searchObj)
    },
    //任务延期
    changeTime() {
      this.formData = this.formData
      this.formStatus = true
    },
    submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        taskCode: this.$route.query.taskCode
      }
      this.delayTaskTime(req)
        .then(res => {
          this.formStatus = false
          this.$message.success('延期成功')
          this.$tools.goNext(() => {
            this.init()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    //账单批量关闭，催缴
    async deleteList(type) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择账单项')
        return
      }
      if (type) {
        await this.shutDownBill(this.chooseList)
        this.$message.success('关闭成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } else {
        await this.callBill(this.chooseList)
        this.$message.success('催缴成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      }
    },
    modify() {
      this.title = '新增账单'
      this.$refs.subForm.addVisible = true
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
    },
    //下载账单
    async handleTplDownload() {
      await this.downBillExcelData({
        name: '账单列表',
        ...this.searchList
      })
      this.$message.success('下载成功')
    },
    clickRow(id) {}
  }
}
</script>
<style lang="less" scoped>
.charge-detail {
  height: 100%;
  padding: 20px;
}
.detail-show {
  background-color: #fff;
  margin-bottom: 10px;
  .top-title {
    background-color: #ececec;
  }
  .title {
    font-size: 18px;
    color: @main-color;
    padding: 10px;
  }
  .mar-top {
    padding-top: 10px;
  }
  .detail-row {
    padding: 10px;
    span {
      padding-left: 20px;
    }
  }
}
</style>
