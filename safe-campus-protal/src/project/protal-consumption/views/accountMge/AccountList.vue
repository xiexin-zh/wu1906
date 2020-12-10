<template>
  <div class="account-list page-layout qui-fx-ver">
    <open-card
      v-if="isOpen"
      v-model="isOpen"
      ref="cardForm"
      :user-code="userCode"
      @hide="hide"
      :userType="userType"
    ></open-card>
    <choose-user @submit="chooseUser" title="请选择用户" v-model="userTag"></choose-user>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" @click="batchAccount">批量开户</a-button>
        <a-button type="primary" class="u-mar-l" @click="_batchAccountSingle">开户</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list is-zoom :page-list="pageList" :columns="accountColumns" :table-list="accountList">
        <template v-slot:actions="action">
          <a-tag color="#2db7f5" @click="toDetail(action.record)">详情</a-tag>
          <!-- v-if="action.record.status === 0" -->
          <a-tag color="#2db7f5" @click="operationRecord(action.record)">操作记录</a-tag>
          <!-- <a-tag color="#2db7f5" @click="handle('补助', action.record)" v-if="action.record.status === 0">补助</a-tag> -->
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="_getAccountList"></page-num>
    <!-- <count-detail
      ref="countDetail"
      isSearch
      v-if="showDetailTag"
      v-model="showDetailTag"
      :columns="columnList.dealColumn"
      :searchLabel="dealSearchLabel"
      chooseType="6"
      :userId="userId"
      title="交易记录"
    ></count-detail> -->
    <batch-model ref="modal" :title="'批量开户'" @ok="batchSubmit">
      <a-row :gutter="[20, 20]">
        <a-col :span="10" :gutter="2">1.下载模板，批量填写人员信息</a-col>
        <a-col :span="10">
          <a-button type="primary" @click="downloadTemplate()">下载模板</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="[20, 20]">
        <a-col :span="10" :gutter="2">2.上传填写好的开户信息Excel文件</a-col>
        <a-col :span="10">
          <a-upload
            style="width: 300px"
            class="qui-fx-ac"
            :multiple="false"
            :showUploadList="true"
            name="file"
            :data="{ fileType: 'xls' }"
            accept=".xls"
            :fileList="fileList"
            :withCredentials="true"
            :customRequest="customRequest"
            :beforeUpload="beforeUpload"
          >
            <a-button type="primary">上传文件</a-button>
          </a-upload>
        </a-col>
      </a-row>
    </batch-model>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseUser from '../../component/ChooseUser'
import ShowDialog from '@c/ShowDialog'
import OpenCard from './OpenCard'
import SearchForm from '@c/SearchForm'
import BatchModel from '../../component/Modal'
import SubmitForm from '../../component/SubmitForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import CountDetail from '../../component/CountDetail'
import accountColumns from '../../assets/table/accountColumns'
/* import columnList from '../../assets/table/consumeColumns' */
import hostEnv from '@config/host-env'
import axios from 'axios'
import { Modal } from 'ant-design-vue'
const searchLabel = [
  {
    value: 'workNo',
    type: 'input',
    label: '学号/工号',
    placeholder: '学号/工号'
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
    value: 'userType',
    type: 'select',
    label: '身份'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'status',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'AccountList',
  components: {
    CountDetail,
    SearchForm,
    TableList,
    PageNum,
    SubmitForm,
    BatchModel,
    ChooseUser,
    OpenCard,
    ShowDialog
  },
  data() {
    return {
      userType: '1',
      fileList: [],
      fileUrl: '',
      userCode: '',
      isOpen: false,
      accountList: [],
      accountColumns,
      searchLabel,
      searchText: {},
      total: 0,
      title: '',
      userTag: false,
      /* columnList, */
      pageList: {
        page: 1,
        size: 20
      },
      cardList: [],
      importParams: {},
      importUrl: '',
      showDetailTag: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getDictList('user_type', 'userType')
    this._getDictList('ecard_account_status', 'status')
    this._getAccountList()
  },
  methods: {
    ...mapActions('home', ['getAccountList', 'getDictList', 'importTemplate']),
    /**
     * @description 数据字典
     */
    async _getDictList(type, text) {
      const i = this.searchLabel.findIndex(list => list.value === text)
      if (i !== -1) this.searchLabel[i].list = []
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: type
      })
      const list = []
      res.rows.forEach(ele => {
        list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      if (i !== -1) {
        this.searchLabel[i].list = list
      }
      window.localStorage.setItem(type, JSON.stringify(list))
      const index = this.accountColumns.findIndex(list => list.dataIndex === text)
      if (index !== -1) {
        this.accountColumns[index].customRender = text => {
          return res.rows.filter(ele => ele.dictValue === text).length > 0
            ? res.rows.filter(ele => ele.dictValue === text)[0].dictLabel
            : ''
        }
      }
    },
    /**
     * @description 获取账户列表
     */
    searchForm(values) {
      this.pageList.page = 1
      this.searchText = values
      this._getAccountList()
    },
    async _getAccountList() {
      const res = await this.getAccountList({
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        ...this.searchText
      })
      this.accountList = res.rows
      this.total = res.total
    },
    /**
     * @description 账户详情
     */
    toDetail(record) {
      this.$router.push({
        path: '/accountList/accountDetails',
        query: {
          id: record.id
        }
      })
    },
    /**
     * @description 选择开户人员
     * @param {user: object} 开户人信息
     */
    chooseUser(user) {
      this.userTag = false
      this.isOpen = true
      this.userCode = user.userCode
      this.userType = user.userType
    },
    hide() {
      this.userTag = true
      this.isOpen = false
    },
    /**
     * @description 单个开户
     */
    _batchAccountSingle() {
      this.userTag = true
    },
    /**
     * @description 批量开户
     */
    batchSubmit() {
      this.$refs.modal.visible = false
    },
    /* showDetail(record) {
      this.userId = record.userId
      this.showDetailTag = true
    }, */
    batchAccount() {
      this.$refs.modal.visible = true
    },
    operationRecord(record) {
      this.$router.push({
        path: '/accountOperationRecord',
        props: true,
        query: {
          userName: record.userName,
          cardStatus: record.status
        }
      })
    },
    async downloadTemplate() {
      await this.importTemplate({
        name: '批量开户模板'
      })
      this.$message.success('下载成功')
    },
    // 上传文件
    beforeUpload(file) {
      console.log(file)
      const isZip = file.type === 'application/vnd.ms-excel'
      if (!isZip) {
        this.$message.error('请上传格式为xls的文件')
      }
      return isZip
    },
    customRequest(data) {
      // 上传提交
      this.resList = []
      const formData = new FormData()
      formData.append('file', data.file)
      this.fileList = [data.file]
      this.saveFile(formData)
    },
    saveFile(formData) {
      axios({
        method: 'post',
        url: `${hostEnv.protal_api_11031}/accountInfo/importData?operator=${this.userInfo.userCode}`,
        data: formData
      })
        .then(res => {
          console.log(res)
          Modal.success({
            content: res.data.msg,
            onOk: () => {
              this.fileList = []
              this._getAccountList()
            }
          })
          this.$refs.modal.visible = false
        })
        .catch(err => {
          console.log(err.response.data.message)
          Modal.error({
            content: err.response.data.message,
            onOk: () => {
              this.fileList = []
            }
          })
        })
    },
    async onFocus(value) {
      this.classesList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeData(req)
      this.classesList = res.data.list
      this.classesList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    },
    uploadFiles() {
      this.$refs.batchImport.addVisible = true
      this.title = '导入文件'
      this.importParams = {
        schoolCode: this.userInfo.schoolCode,
        operator: this.userInfo.userCode
      }
      this.importUrl = `/protal_api_11031/accountInfo/importData?operator=${this.userInfo.userCode}`
    },
    // 导入成功
    handleUploadSuccess() {
      this.$refs.batchImport.addVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.account-list {
  padding: 20px 20px 0;
}
</style>
