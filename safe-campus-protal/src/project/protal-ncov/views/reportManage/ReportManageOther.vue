<template>
  <div class="page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="addApp">上报</a-button>
        <a-button icon="export" class="export-btn" @click="downFile">导出</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="userList">
      <template v-slot:other5="action">
        <div v-if="action.record.enableFever === false">{{ action.record.enableFever ? '发热' : '未发热' }}</div>
        <a-tag color="#e80000" v-else>{{ action.record.enableFever ? '发热' : '未发热' }}</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import hostEnv from '@/config/host-env'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import SubmitForm from '@c/SubmitForm'
import Tools from '@u/tools'

const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'sex',
    initValue: [],
    list: [
      {
        key: 1,
        val: '男'
      },
      {
        key: 2,
        val: '女'
      },
      {
        key: 3,
        val: '未知'
      }
    ],
    type: 'select',
    label: '性别',
    placeholder: '请选择性别'
  },
  {
    value: 'temperature',
    initValue: '',
    type: 'numberInput',
    min: 30,
    max: 40,
    label: '体温',
    placeholder: '请输入请输入体温'
  }
]
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: text => {
      if (text === '1') {
        return '男'
      } else if (text === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '10%'
  },
  {
    title: '发热状态',
    width: '10%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '12%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '13%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '13%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snacpUrl',
    width: '13%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 'false',
        val: '未发热'
      },
      {
        key: 'true',
        val: '发热'
      }
    ],
    value: 'enableFever',
    type: 'select',
    label: '状态'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '上报时间',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
export default {
  name: 'ReportManageOther',
  components: {
    TableList,
    SearchForm,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      columns,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        userType: '64',
        schoolCode: ''
      },
      total: 0,
      userList: [],
      formStatus: false,
      formData,
      title: '上报疫情'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getReportInfoList', 'addReport']),
    async submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        reportName: this.userInfo.userName,
        userType: '64'
      }
      try {
        await this.addReport(req)
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    addApp(type, record) {
      this.formStatus = true
      this.title = '上报疫情'
      this.formData = formData
    },
    async showList(searchObj = {}) {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const res = await this.getReportInfoList(this.searchList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    // downFile() {
    //   this.startDate = '2020-01-01'
    //   this.endDate = '2020-10-01'
    //   this.schoolCode = this.userInfo.schoolCode
    //   window.open(
    //     `${hostEnv.protal_api_11005}/day/record/download/64?schoolCode=${this.schoolCode}&startDate=${this.startDate}&endDate=${this.endDate}`
    //   )
    // },
    downFile() {
      var url = `${hostEnv.protal_api_11005}/day/record/download`
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function() {
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
      const req = {
        ...this.searchList,
        startDate: this.startDate,
        endDate: this.endDate
      }
      xhr.send(JSON.stringify(req))
    },
    searchForm(values) {
      this.pageList.page = 1
      this.startDate = values.rangeTime[0]
      this.endDate = values.rangeTime[1]
      const searchObj = {
        enableFever: values.enableFever,
        startDate: values.rangeTime[0],
        endDate: values.rangeTime[1]
      }
      this.showList(searchObj)
    }
  }
}
</script>
<style lang="less" scoped>
.top {
  margin-bottom: 10px;
}
</style>
